const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { createWriteStream } = require("fs");
const archiver = require("archiver");

const TMP_DIR = path.resolve(".tmp_build");
const BUILD_DIR = path.resolve("build");
const BACKEND_DIR = path.resolve("backend");
const viteFolder = path.join(BACKEND_DIR, "public", "build", ".vite");
const viteManifest = path.join(BACKEND_DIR, "public", "build", ".vite", "manifest.json");
const publicBuildTarget = path.join(BUILD_DIR, "public", "build");

const installerSource = path.resolve("install.php");
const installerTarget = path.join(BUILD_DIR, "public", "install.php");

function log(msg) {
  console.log("🛠️  " + msg);
}

function run(cmd, cwd) {
  execSync(cmd, { stdio: "inherit", cwd });
}

function copyRecursive(src, dest, excludes = []) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });

  for (const item of fs.readdirSync(src)) {
    const from = path.join(src, item);
    const to = path.join(dest, item);

    if (excludes.some(ex => from.includes(ex))) continue;

    const stats = fs.statSync(from);
    if (stats.isDirectory()) {
      copyRecursive(from, to, excludes);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function cleanTmp(){
  if (fs.existsSync(TMP_DIR)) fs.rmSync(TMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TMP_DIR);
}
function clean() {
  if (fs.existsSync(BUILD_DIR)) fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  fs.mkdirSync(BUILD_DIR);
}

function copyEnvFile() {
  const envProd = path.join(BACKEND_DIR, ".env.production");
  const env = path.join(BACKEND_DIR, ".env");
  const target = path.join(TMP_DIR, ".env");

  if (fs.existsSync(envProd)) {
    log("Using .env.production");
    fs.copyFileSync(envProd, target);
  } else if (fs.existsSync(env)) {
    log("Using fallback .env");
    fs.copyFileSync(env, target);
  } else {
    throw new Error("No .env or .env.production found.");
  }
}

function writeHtaccess() {
  const htaccess = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^ index.php [QSA,L]
</IfModule>
`.trim();

  fs.writeFileSync(path.join(TMP_DIR, "public", ".htaccess"), htaccess);
}

function createZip(sourceDir, zipPath, excludes = []) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);
    archive.glob("**/*", {
      cwd: sourceDir,
      ignore: excludes,
      dot: true
    });
    archive.finalize();
  });
}


// === MAIN ===

clean();
cleanTmp();
log("Running frontend build...");

run("npm install", path.resolve("frontend"));
run("npm run build", path.resolve("frontend"));
if (!fs.existsSync(viteManifest)) {
  throw new Error("❌ manifest.json not found. Did you forget to build the frontend?");
}

log("Copying frontend build to public/build...");
copyRecursive(viteFolder, publicBuildTarget);

log("Installing Laravel dependencies...");
run("composer install --optimize-autoloader --no-dev", BACKEND_DIR);

log("Caching Laravel config...");
run("php artisan config:cache", BACKEND_DIR);
run("php artisan route:cache", BACKEND_DIR);
run("php artisan view:cache", BACKEND_DIR);
run("php artisan storage:link", BACKEND_DIR);

log("Copying Laravel structure...");
copyRecursive(BACKEND_DIR, TMP_DIR, [
  "node_modules",
  "tests",
  ".env",
  ".env.production",
  "storage/logs",
]);

log("Copying vendor...");
copyRecursive(path.join(BACKEND_DIR, "vendor"), path.join(TMP_DIR, "vendor"));

log("Injecting environment file...");
copyEnvFile();

// log("Writing .htaccess...");
// writeHtaccess();

console.log(`
📦 Deployment Instructions for cPanel / Nethely:

1. Upload the entire contents of the /build folder to your hosting account.
2. In cPanel or Nethely, set the domain’s root directory to:

   → /build/public   (or use it as public_html)

✅ No need to modify index.php or run artisan on the server.
`.trim());

log("✅ DONE! Upload /build as-is to your hosting and point domain to /public.");

(async () => {
  const zipPath = path.join(BUILD_DIR, "astelium.zip");
  log("📦 Creating astelium.zip...");
  await createZip(TMP_DIR, zipPath, ["install.php", "astelium.zip"]);

  fs.mkdirSync(path.dirname(installerTarget), { recursive: true });
  fs.copyFileSync(installerSource, installerTarget);
  console.log("📄 install.php copied to build/");

// Console instructions
  console.log(`
✅ Upload Instructions:

1. Upload everything from /build to your server
2. Set the domain root to /build/public (or public_html)
3. Open /install.php in browser and follow DB setup

ℹ️ After success, delete install.php for security.
`);

  cleanTmp();
})()
