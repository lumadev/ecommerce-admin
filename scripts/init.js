import { execFileSync, execSync, spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backendDir = path.resolve(rootDir, "..", "ecommerce-3d-back");

const DB_CONTAINER = "postgres-db";
const BACKEND_HOST = "localhost";
const DEFAULT_BACKEND_PORT = 3000;
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

const readBackendEnv = (key) => {
  const envPath = path.join(backendDir, ".env");
  if (!existsSync(envPath)) return undefined;
  const match = readFileSync(envPath, "utf8").match(
    new RegExp(`^${key}=["']?(.+?)["']?\\s*$`, "m"),
  );
  return match?.[1];
};

// Porta do backend: PORT do ambiente, depois PORT do .env do backend.
const resolveBackendPort = () => {
  const port = Number(process.env.BACKEND_PORT ?? readBackendEnv("PORT"));
  return Number.isInteger(port) && port > 0 && port < 65536
    ? port
    : DEFAULT_BACKEND_PORT;
};

// Lê usuário, nome e porta do banco do .env do backend (DATABASE_URL).
const readDatabaseConfig = () => {
  const defaults = { user: "postgres", name: "postgres", port: 5432 };
  const rawUrl = readBackendEnv("DATABASE_URL");
  if (!rawUrl) return defaults;
  const match = [null, rawUrl];

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
    port: Number(url.port) || 5432,
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
  const { user, name, port } = readDatabaseConfig();

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
    if (!exe) {
      throw new Error(
        "Docker não está rodando e o Docker Desktop não foi encontrado nos caminhos padrão nem ao lado do docker.exe no PATH. Inicie o Docker Desktop ou o daemon e tente novamente.",
      );
    }

    log("Abrindo Docker Desktop...");
    spawn(exe, [], { detached: true, stdio: "ignore", windowsHide: true }).unref();
    await waitFor(async () => isDockerUp(), "Docker Desktop", DOCKER_START_TIMEOUT_MS);
  }

  // Prefere o container que publica a porta da DATABASE_URL; senão usa o padrão.
  let container = DB_CONTAINER;
  try {
    const published = runDocker([
      "ps",
      "-a",
      "--filter",
      `publish=${port}`,
      "--format",
      "{{.Names}}",
    ])
      .split(/\r?\n/)
      .filter(Boolean);
    if (published.length > 0 && !published.includes(DB_CONTAINER)) {
      container = published[0];
    }
  } catch {
    // Mantém o container padrão.
  }

  let running = false;
  try {
    running = runDocker(["inspect", "-f", "{{.State.Running}}", container]) === "true";
  } catch {
    throw new Error(`Container "${container}" não existe.`);
  }

  if (running) {
    log(`Container ${container} já está ativo.`);
  } else {
    log(`Subindo container ${container}...`);
    runDocker(["start", container]);
  }

  await waitFor(async () => {
    try {
      runDocker(["exec", container, "pg_isready", "-U", user, "-d", name]);
      return true;
    } catch {
      return false;
    }
  }, `banco "${name}"`);

  if (!(await isPortOpen(BACKEND_HOST, port))) {
    throw new Error(
      `O container "${container}" está pronto, mas a porta ${port} (DATABASE_URL) não está acessível em localhost. Publique a porta (-p ${port}:5432) ou ajuste a porta da DATABASE_URL no .env do backend.`,
    );
  }
  log(`Banco "${name}" pronto em localhost:${port}.`);
};

const children = [];

const startProcess = (label, cwd, env = {}) => {
  const child = spawn("pnpm dev", {
    cwd,
    shell: true,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
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

const ensureBackend = async (port) => {
  if (await isPortOpen(BACKEND_HOST, port)) {
    log(`Backend já está rodando na porta ${port}.`);
    return;
  }

  log(`Subindo backend na porta ${port}...`);
  startProcess("backend", backendDir, { PORT: String(port) });
  await waitFor(() => isPortOpen(BACKEND_HOST, port), "backend");
  log("Backend pronto.");
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("exit", shutdown);

try {
  await ensureDatabase();
  const backendPort = resolveBackendPort();
  await ensureBackend(backendPort);
  log("Subindo frontend...");
  startProcess(
    "frontend",
    rootDir,
    process.env.VITE_API_URL
      ? {}
      : { VITE_API_URL: `http://${BACKEND_HOST}:${backendPort}/api` },
  );
} catch (error) {
  console.error(`[init] ${error.message}`);
  shutdown();
  process.exit(1);
}
