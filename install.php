<?php
function showError($message) {
  exit("<pre style='color: red;'>❌ $message</pre>");
}

function showSuccess($message) {
  echo "<pre style='color: green;'>✅ $message</pre>";
}

$appRoot = realpath(__DIR__ . '/..');
$alreadyInstalled = false;//file_exists($appRoot . '/vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if ($alreadyInstalled) {
    showError("Astelium already installed.");
  }

  $db = $_POST['db'];
  $zipFile = $appRoot . '/astelium.zip';

  if (!file_exists($zipFile)) {
    showError("Missing ZIP file: astelium.zip");
  }

  // ✅ Check DB connection
  try {
    $pdo = new PDO(
      "mysql:host={$db['host']};port={$db['port']};dbname={$db['name']}",
      $db['user'],
      $db['pass'],
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
  } catch (PDOException $e) {
    showError("Database connection failed: " . $e->getMessage());
  }
  showSuccess("Database connection verified.");

  // ✅ Extract ZIP
  $zip = new ZipArchive;
  if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($appRoot);
    $zip->close();
    unlink($zipFile);
    showSuccess("ZIP extracted.");
  } else {
    showError("Failed to open ZIP archive.");
  }
  $baseUrl = rtrim($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']), '/');

  // ✅ Write .env
  $env = <<<ENV
APP_ENV=production
APP_KEY=
APP_URL={$baseUrl}

DB_CONNECTION=mariadb
DB_HOST={$db['host']}
DB_PORT={$db['port']}
DB_DATABASE={$db['name']}
DB_USERNAME={$db['user']}
DB_PASSWORD={$db['pass']}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

LOG_CHANNEL=stack
ENV;

  if (!file_put_contents($appRoot . '/.env', $env)) {
    showError("Failed to write .env file.");
  }
  showSuccess(".env file written.");

  // ✅ Artisan: key:generate
  echo "<pre>🔑 Generating app key...</pre>";
  passthru("php {$appRoot}/artisan config:clear 2>&1"); // ⬅ Add this line
  $key = shell_exec("php {$appRoot}/artisan key:generate 2>&1");
  if (strpos($key, 'Application key set') === false) {
    showError("Failed to generate app key:\n$key");
  }
  showSuccess("Application key generated.");

  // ✅ Artisan: migrate
  $migrate = shell_exec("php {$appRoot}/artisan migrate:fresh --force 2>&1");
  if (str_contains($migrate, 'FAIL')) {
    showError("Migration failed:\n$migrate");
  } else {
    showSuccess("Database migrated.");
  }
  $seed = shell_exec("php {$appRoot}/artisan db:seed --force 2>&1");
  if (str_contains($seed, 'Exception') || str_contains($seed, 'ERROR')) {
    showError("Seeding failed:\n$seed");
  } else {
    showSuccess("Database seeded.");
  }

  // ✅ Cleanup
  unlink(__FILE__);
  showSuccess("Installer removed.");

  exit("<pre>🎉 Astelium installed successfully. You may now log in.</pre>");
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Astelium Installer</title>
  <style>
    body { font-family: sans-serif; background: #f9f9f9; display: flex; justify-content: center; align-items: center; height: 100vh; }
    form { background: white; padding: 2rem; border-radius: 10px; max-width: 400px; width: 100%; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    h2 { text-align: center; margin-bottom: 1rem; }
    label { display: block; margin: 0.5rem 0 0.25rem; }
    input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; }
    button { background: #2563eb; color: white; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
<form method="POST">
  <h2>Install Astelium</h2>

  <label>DB Host</label>
  <input name="db[host]" value="127.0.0.1" required>

  <label>DB Port</label>
  <input name="db[port]" value="3306" required>

  <label>DB Name</label>
  <input name="db[name]" required>

  <label>DB Username</label>
  <input name="db[user]" required>

  <label>DB Password</label>
  <input name="db[pass]" type="password">

  <button type="submit">Install</button>
</form>
</body>
</html>
