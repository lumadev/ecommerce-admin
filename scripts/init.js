import { execFileSync, execSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backendDir = path.resolve(rootDir, "..", "ecommerce-3d-back");

const DB_CONTAINER = "postgres-db";
const BACKEND_HOST = "localhost";
const BACKEND_PORT = 3000;
const WAIT_TIMEOUT_MS = 60000;
const DOCKER_START_TIMEOUT_MS = 180000;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

const log = (message) => console.log(`[init] ${message}`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runDocker = (args) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  }).trim();

const isPortOpen = (host, port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, host);
    socket.setTimeout(1500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });

const waitFor = async (check, label, timeoutMs = WAIT_TIMEOUT_MS) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await check()) return;
    await sleep(1000);
  }
  throw new Error(`Timeout aguardando ${label}`);
};

// Lê usuário e nome do banco do .env do backend (DATABASE_URL).
const readDatabaseConfig = () => {
  const envPath = path.join(backendDir, ".env");
  if (!existsSync(envPath)) return { user: "postgres", name: "postgres" };

  const match = readFileSync(envPath, "utf8").match(/^DATABASE_URL=["']?(.+?)["']?\s*$/m);
  if (!match) return { user: "postgres", name: "postgres" };

  const value = match[1].replace(/^(?:(["'])(.*)\1|([^#\s]+)).*$/, "$2$3");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("DATABASE_URL inválida no .env do backend.");
  }

  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new Error("DATABASE_URL deve usar postgres ou postgresql.");
  }

  const host = url.hostname || "localhost";
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `DATABASE_URL deve apontar para um banco local (localhost/127.0.0.1/::1), recebido: ${host}.`,
    );
  }

  if (url.searchParams.get("host")?.startsWith("/cloudsql/")) {
    throw new Error(
      "DATABASE_URL aponta para Cloud SQL (/cloudsql/...), não para o container local.",
    );
  }

  const user = decodeURIComponent(url.username) || "postgres";
  const name = url.pathname.replace(/^\//, "") || "postgres";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(user)) {
    throw new Error("Usuário do banco inválido (apenas letras, números e _).");
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error("Nome do banco inválido (apenas letras, números e _).");
  }

  return {
    user,
    name,
  };
};

const resolveDockerDesktopExe = () => {
  if (process.platform !== "win32") return null;

  const candidates = [
    path.join(
      process.env.ProgramFiles ?? "C:\\Program Files",
      "Docker",
      "Docker",
      "Docker Desktop.exe",
    ),
    process.env.LOCALAPPDATA
      ? path.join(
          process.env.LOCALAPPDATA,
          "Programs",
          "DockerDesktop",
          "Docker Desktop.exe",
        )
      : null,
  ];

  try {
    const dockerBin = execFileSync("where.exe", ["docker"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.toLowerCase().endsWith("docker.exe"));

    if (dockerBin) {
      candidates.push(
        path.resolve(path.dirname(dockerBin), "..", "..", "Docker Desktop.exe"),
      );
    }
  } catch {
    // O Docker CLI pode não estar no PATH; os caminhos padrão ainda serão verificados.
  }

  return candidates.find((exe) => exe && existsSync(exe)) ?? null;
};

const ensureDatabase = async () => {
  const { user, name } = readDatabaseConfig();

  const isDockerUp = () => {
    try {
      runDocker(["info"]);
      return true;
    } catch {
      return false;
    }
  };

  if (!isDockerUp()) {
    const exe = resolveDockerDesktopExe();
    if (!existsSync(exe)) {
      throw new Error(
        "Docker não está rodando e o Docker Desktop não foi encontrado nos caminhos padrão nem ao lado do docker.exe no PATH. Inicie o Docker Desktop ou o daemon e tente novamente.",
      );
    }

    log("Abrindo Docker Desktop...");
    spawn(exe, [], { detached: true, stdio: "ignore", windowsHide: true }).unref();
    await waitFor(async () => isDockerUp(), "Docker Desktop", DOCKER_START_TIMEOUT_MS);
  }

  let running = false;
  try {
    running =
      runDocker(["inspect", "-f", "{{.State.Running}}", DB_CONTAINER]) === "true";
  } catch {
    throw new Error(`Container "${DB_CONTAINER}" não existe.`);
  }

  if (running) {
    log(`Container ${DB_CONTAINER} já está ativo.`);
  } else {
    log(`Subindo container ${DB_CONTAINER}...`);
    runDocker(["start", DB_CONTAINER]);
  }

  await waitFor(async () => {
    try {
      runDocker(["exec", DB_CONTAINER, "pg_isready", "-U", user, "-d", name]);
      return true;
    } catch {
      return false;
    }
  }, `banco "${name}"`);
  log(`Banco "${name}" pronto.`);
};

const children = [];

const startProcess = (label, cwd) => {
  const child = spawn("pnpm dev", { cwd, shell: true, stdio: "inherit" });
  child.on("exit", (code) => log(`${label} finalizou (código ${code}).`));
  children.push(child);
  return child;
};

const shutdown = () => {
  for (const child of children) {
    if (child.pid && child.exitCode === null) {
      try {
        execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore" });
      } catch {
        child.kill();
      }
    }
  }
};

const ensureBackend = async () => {
  if (await isPortOpen(BACKEND_HOST, BACKEND_PORT)) {
    log(`Backend já está rodando na porta ${BACKEND_PORT}.`);
    return;
  }

  log("Subindo backend...");
  startProcess("backend", backendDir);
  await waitFor(() => isPortOpen(BACKEND_HOST, BACKEND_PORT), "backend");
  log("Backend pronto.");
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("exit", shutdown);

try {
  await ensureDatabase();
  await ensureBackend();
  log("Subindo frontend...");
  startProcess("frontend", rootDir);
} catch (error) {
  console.error(`[init] ${error.message}`);
  shutdown();
  process.exit(1);
}
