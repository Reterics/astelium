<?php
function showError($message) {
  exit("<pre class='error'>❌ $message</pre>");
}

function showSuccess($message) {
  echo "<pre style='color: green;'>✅ $message</pre>";
}

$appRoot = realpath(__DIR__ . '/../..');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $db = $_POST['db'];
  $zipFile = realpath(__DIR__) . '/astelium.zip';

  if (!file_exists($zipFile)) {
    showError("Missing ZIP file: astelium.zip");
  }

  // ✅ Check DB connection
  try {
    // Connect without specifying a database
    $pdo = new PDO(
      "mysql:host={$db['host']};port={$db['port']}",
      $db['user'],
      $db['pass'],
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Create the database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db['name']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    // Reconnect using the newly created database
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
  $scheme = $_SERVER['REQUEST_SCHEME'];
  $host = $_SERVER['HTTP_HOST'];
  $dir = dirname($_SERVER['SCRIPT_NAME']);
  $baseDir = preg_replace('#/maintenance/?$#', '', $dir);
  $baseUrl = rtrim("{$scheme}://{$host}{$baseDir}", '/');

  // $baseUrl = rtrim($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']), '/');
  function generateLaravelAppKey(): string {
    // Generate a 32-byte random key and base64-encode it
    $randomBytes = random_bytes(32);
    return 'base64:' . base64_encode($randomBytes);
  }

  $appKey = generateLaravelAppKey();
  // ✅ Write .env
  $env = <<<ENV
APP_ENV=production
APP_KEY={$appKey}
APP_URL={$baseUrl}

DB_CONNECTION=mariadb
DB_HOST={$db['host']}
DB_PORT={$db['port']}
DB_DATABASE={$db['name']}
DB_USERNAME={$db['user']}
DB_PASSWORD={$db['pass']}

APP_SETUP_MODE=true
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=warning
ENV;

  if (!file_put_contents($appRoot . '/.env', $env)) {
    showError("Failed to write .env file.");
  }
  showSuccess(".env file written.");

  function post($url)
  {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
      CURLOPT_POSTFIELDS => '{}',
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    return $error;
  }
  $error = post($baseUrl . '/api/maintenance/post-install');

  if ($error) {
    echo "❌ Request failed: $error";
    echo "Use alternate solution: exec and passthrough";

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
    passthru("php {$appRoot}/artisan config:cache 2>&1");
  } else {
    echo "✅ Post Install request successful to API";
  }

  if (function_exists('passthru')) {
    passthru("php {$appRoot}/artisan storage:link 2>&1");
    return null;
  }

  exit("<pre>🎉 Astelium installed successfully. You may now log in.</pre>");
}
?>
<div class="panel">
  <div class="panel-title">Install / Reinstall</div>
  <form method="post" autocomplete="off">
    <div class="form-group">
      <label for="db_host">Database Host</label>
      <input type="text" name="db[host]" id="db_host" required autocomplete="database_host" value="127.0.0.1">
    </div>
    <div class="form-group">
      <label for="db_port">Database Port</label>
      <input type="number" name="db[port]" id="db_port" value="3306" required autocomplete="database_port">
    </div>
    <div class="form-group">
      <label for="db_name">Database Name</label>
      <input type="text" name="db[name]" id="db_name" required autocomplete="database_name" value="astelium">
    </div>
    <div class="form-group">
      <label for="db_user">Database User</label>
      <input type="text" name="db[user]" id="db_user" required autocomplete="database_user" value="root">
    </div>
    <div class="form-group">
      <label for="db_pass">Database Password</label>
      <input type="password" name="db[pass]" id="db_pass" autocomplete="database_password" value="">
    </div>
    <div class="button-row">
      <button type="submit">Install</button>
      <a href="?view=home" class="button button-secondary">Back</a>
    </div>
  </form>
</div>
