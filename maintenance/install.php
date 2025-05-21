<?php
function showStep($label, $status, $message) {
  return ['label' => $label, 'status' => $status, 'message' => $message];
}

// ==== STEP LOGIC FUNCTIONS ====
function tryDb($db) {
  try {
    $pdo = new PDO(
      "mysql:host={$db['host']};port={$db['port']}",
      $db['user'],
      $db['pass'],
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$db['name']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo = new PDO(
      "mysql:host={$db['host']};port={$db['port']};dbname={$db['name']}",
      $db['user'],
      $db['pass'],
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    return showStep('Database connection', 'ok', 'Connection and database creation verified.');
  } catch (PDOException $e) {
    return showStep('Database connection', 'fail', "Database connection failed: " . $e->getMessage());
  }
}

function tryUnzip($zipFile, $appRoot) {
  if (!file_exists($zipFile)) {
    return showStep('Extract ZIP', 'fail', "Missing ZIP file: astelium.zip");
  }
  $zip = new ZipArchive;
  if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo($appRoot);
    $zip->close();
    unlink($zipFile);
    return showStep('Extract ZIP', 'ok', "ZIP extracted.");
  } else {
    return showStep('Extract ZIP', 'fail', "Failed to open ZIP archive.");
  }
}

function generateLaravelAppKey(): string {
  $randomBytes = random_bytes(32);
  return 'base64:' . base64_encode($randomBytes);
}

function writeEnv($appRoot, $db, $baseUrl) {
  $appKey = generateLaravelAppKey();
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
    return showStep('.env write', 'fail', "Failed to write .env file.");
  }
  return showStep('.env write', 'ok', ".env file written.");
}

function tryApiPost($url) {
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
  if ($error) {
    return showStep('API Post-install', 'fail', "Request failed: $error (Will run fallback commands)");
  } else {
    return showStep('API Post-install', 'ok', "Post Install request successful to API.");
  }
}

function runArtisanFallback($appRoot) {
  $steps = [];
  $migrate = shell_exec("php {$appRoot}/artisan migrate:fresh --force 2>&1");
  if (str_contains($migrate, 'FAIL')) {
    $steps[] = showStep('Artisan migrate', 'fail', "Migration failed:\n$migrate");
  } else {
    $steps[] = showStep('Artisan migrate', 'ok', "Database migrated.");
  }
  $seed = shell_exec("php {$appRoot}/artisan db:seed --force 2>&1");
  if (str_contains($seed, 'Exception') || str_contains($seed, 'ERROR')) {
    $steps[] = showStep('Artisan seed', 'fail', "Seeding failed:\n$seed");
  } else {
    $steps[] = showStep('Artisan seed', 'ok', "Database seeded.");
  }
  // Even if above failed, always try config:cache and storage:link
  $steps[] = showStep('Artisan config:cache', 'ok', passthru("php {$appRoot}/artisan config:cache 2>&1"));
  if (function_exists('passthru')) {
    $steps[] = showStep('Artisan storage:link', 'ok', passthru("php {$appRoot}/artisan storage:link 2>&1"));
  }
  return $steps;
}

// ==== PROCESS FORM & STEPS ====
$steps = [];
$finalSuccess = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $appRoot = realpath(__DIR__ . '/../..');
  $zipFile = realpath(__DIR__) . '/astelium.zip';
  $scheme = $_SERVER['REQUEST_SCHEME'];
  $host = $_SERVER['HTTP_HOST'];
  $dir = dirname($_SERVER['SCRIPT_NAME']);
  $baseDir = preg_replace('#/maintenance/?$#', '', $dir);
  $baseUrl = rtrim("{$scheme}://{$host}{$baseDir}", '/');
  $db = $_POST['db'];

  $steps[] = $s = tryDb($db);
  if ($s['status'] === 'ok') {
    $steps[] = $s = tryUnzip($zipFile, $appRoot);
  }
  if (end($steps)['status'] === 'ok') {
    $steps[] = $s = writeEnv($appRoot, $db, $baseUrl);
  }
  if (end($steps)['status'] === 'ok') {
    $apiStep = tryApiPost($baseUrl . '/api/maintenance/post-install');
    $steps[] = $apiStep;
    if ($apiStep['status'] === 'fail') {
      // Fallback: run artisan commands
      $steps = array_merge($steps, runArtisanFallback($appRoot));
    }
  }
  // Set final flag if all steps succeeded
  $finalSuccess = count(array_filter($steps, fn($x) => $x['status'] === 'fail')) === 0;
}
?>
<style>
  .panel {
    max-width: 430px;
    margin: 2.5rem auto 0 auto;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f8fafc;
    padding: 2.2rem 1.5rem 2.3rem 1.5rem;
    font-family: inherit;
  }
  .panel-title {
    font-size: 1.13rem;
    font-weight: 600;
    margin-bottom: 1.1rem;
    color: #222;
    text-align: center;
  }
  .form-group { margin: 1.1em 0; }
  .form-group label { display:block; font-size:0.99em; font-weight:500; margin-bottom:0.18em; }
  .form-group input { width:100%; font-size:1em; padding:0.6em 0.7em; border:1px solid #d1d5db; border-radius:4px;}
  .button-row { display: flex; gap: 1.2em; justify-content: center; margin-top:1.5em;}
  button, .button { background: #2563eb; color: #fff; border: none; padding: 0.67em 2em; border-radius: 5px;
    font-weight: 500; font-size: 1rem; cursor: pointer; transition: background 0.13s;}
  .button-secondary { background: #cbd5e1; color: #334155; text-decoration: none;}
  ul.installer-steps { margin:2em 0 1em 0; padding:0; list-style:none; }
  ul.installer-steps li { margin:0.6em 0; padding:0.65em 1em; border-radius:6px;
    font-size:1em; font-family:monospace; white-space:pre-wrap; border:1px solid #e5e7eb;}
  ul.installer-steps li.ok { background:#e6faed; color:#15803d; border-color:#c0f2d2;}
  ul.installer-steps li.fail { background:#fee2e2; color:#b91c1c; border-color:#fecaca;}
  .final-success { color: #15803d; font-weight: 600; margin-top:1em; text-align:center;}
  .final-fail { color: #b91c1c; font-weight: 600; margin-top:1em; text-align:center;}
</style>

<div class="panel">
  <div class="panel-title">Install / Reinstall</div>
  <form method="post" autocomplete="off"<?php if ($steps) echo ' style="display:none"'; ?>>
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

  <?php if ($steps): ?>
    <ul class="installer-steps">
      <?php foreach ($steps as $step): ?>
        <li class="<?= $step['status'] ?>">
          <?= htmlspecialchars($step['label']) ?>: <?= ($step['status']==='ok' ? '✔' : '✖') ?> <?= htmlspecialchars($step['message']) ?>
        </li>
      <?php endforeach; ?>
    </ul>
    <?php if ($finalSuccess): ?>
      <div class="final-success">🎉 Astelium installed successfully. You may now log in.</div>
    <?php else: ?>
      <div class="final-fail">Some steps failed. Please review above and retry.</div>
      <div class="button-row" style="margin-bottom:1em;">
        <a href="" class="button">Retry</a>
        <a href="?view=home" class="button button-secondary">Back</a>
      </div>
    <?php endif; ?>
  <?php endif; ?>
</div>
