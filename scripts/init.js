import { execSync, spawn } from "node:child_process";
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

const log = (message) => console.log(`[init] ${message}`);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = (command) =>
  execSync(command, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();

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

  const url = new URL(match[1]);
  return {
    user: decodeURIComponent(url.username) || "postgres",
    name: url.pathname.replace(/^\//, "") || "postgres",
  };
};

const ensureDatabase = async () => {
  const { user, name } = readDatabaseConfig();

  const isDockerUp = () => {
    try {
      run("docker info");
      return true;
    } catch {
      return false;
    }
  };

  if (!isDockerUp()) {
    const exe = path.join(
      process.env.ProgramFiles ?? "C:\\Program Files",
      "Docker",
      "Docker",
      "Docker Desktop.exe",
    );
    if (!existsSync(exe)) {
      throw new Error("Docker não está rodando e o Docker Desktop não foi encontrado.");
    }

    log("Abrindo Docker Desktop...");
    spawn(exe, { detached: true, stdio: "ignore" }).unref();
    await waitFor(async () => isDockerUp(), "Docker Desktop", DOCKER_START_TIMEOUT_MS);
  }

  let running = false;
  try {
    running = run(`docker inspect -f "{{.State.Running}}" ${DB_CONTAINER}`) === "true";
  } catch {
    throw new Error(`Container "${DB_CONTAINER}" não existe.`);
  }

  if (running) {
    log(`Container ${DB_CONTAINER} já está ativo.`);
  } else {
    log(`Subindo container ${DB_CONTAINER}...`);
    run(`docker start ${DB_CONTAINER}`);
  }

  await waitFor(async () => {
    try {
      run(`docker exec ${DB_CONTAINER} pg_isready -U ${user} -d ${name}`);
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
