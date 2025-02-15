const { execSync, spawn } = require("child_process");
const net = require("net");
const {join, resolve} = require("node:path");
const {existsSync, writeFileSync} = require("node:fs");

// Configuration
const MYSQL_PORT = 3306;
const MYSQL_CONTAINER_NAME = "mysql";
const BACKEND_PATH = "./backend";
const SQLITE_DB_PATH = resolve(join(__dirname, "backend"), "database", "database.sqlite");
const shouldSeed = process.argv.includes("--seed");

function getComposerCommand() {
  try {
    const command = process.platform === "win32" ? "where composer" : "which composer";
    const composerPath = execSync(command).toString().trim();

    if (!composerPath) {
      throw new Error();
    }
    if (process.platform === "win32") {
      const list = composerPath.split("\r\n")
      const batIndex = list.findIndex(path => path.endsWith(".bat"));
      if (batIndex > -1) {
        return list[0]
      }
      return list[batIndex]
    }
    return composerPath;
  } catch (error) {
    console.error("❌ ERROR: Composer is not installed or not found in system PATH.");
    process.exit(1);
  }
}


function isMySQLRunning() {
  return new Promise((resolve) => {
    const socket = net.createConnection(MYSQL_PORT, "127.0.0.1", () => {
      socket.end();
      resolve(true);
    });

    socket.on("error", () => {
      resolve(false);
    });
  });
}

function isDockerAvailable() {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function startMySQLContainer() {
  console.log("Starting MySQL container...");
  try {
    execSync(
      `docker run -d --name ${MYSQL_CONTAINER_NAME} --restart unless-stopped -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=laravel_db -e MYSQL_USER=laravel_user -e MYSQL_PASSWORD=laravel_pass -v mysql_data:/var/lib/mysql -p 3306:3306 mysql:8.0`,
      { stdio: "inherit" }
    );
    console.log("MySQL container started successfully.");
  } catch (error) {
    console.error("Failed to start MySQL container:", error.message);
    process.exit(1);
  }
}


(async () => {
  const mysqlRunning = await isMySQLRunning();
  const env = {...process.env};

  if (mysqlRunning) {
    console.log("✅ MySQL is already running on port 3306.");
    env.DB_DATABASE='laravel_db'
    env.DB_USERNAME='laravel_user'
    env.DB_PASSWORD='laravel_pass'

  } else {
    console.log("⚠️ MySQL is not running on port 3306.");

    if (isDockerAvailable()) {
      env.DB_DATABASE='laravel_db'
      env.DB_USERNAME='laravel_user'
      env.DB_PASSWORD='laravel_pass'
      startMySQLContainer();
    } else {
      console.log("❌ Docker is not running. Switching to SQLite.");
      env.DB_CONNECTION = "sqlite";
      env.DB_DATABASE = SQLITE_DB_PATH;
      // Ensure SQLite database file exists
      if (!existsSync(SQLITE_DB_PATH)) {
        console.log(`🔧 Creating SQLite database at ${SQLITE_DB_PATH}`);
        writeFileSync(SQLITE_DB_PATH, "");
      }
    }
  }

  const COMPOSER_CMD = getComposerCommand();
  const processOptions = {
    cwd: BACKEND_PATH,
    env: env,
    stdio: "inherit",
    shell: true
  }

  console.log("🚀 Starting backend...");
  spawn(COMPOSER_CMD, ["install"], processOptions);

  console.log("📜 Running database migrations...");
  try {
    execSync("php artisan migrate ", processOptions);
  } catch (error) {
    console.error("❌ ERROR: Failed to run migrations:", error.message);
    process.exit(1);
  }

  if (shouldSeed) {
    console.log("🌱 Running database seeder...");
    try {
      execSync("php artisan db:seed", processOptions);
    } catch (error) {
      console.error("❌ ERROR: Failed to seed database:", error.message);
      process.exit(1);
    }
  }

  const backendProcess = spawn("php", ["artisan", "serve"], {
    ...processOptions,
    shell: undefined
  });

  backendProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
})();
