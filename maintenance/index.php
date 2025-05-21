<?php
$current = $_GET['view'] ?? 'home';

function isActive($view) {
  global $current;
  return $view === $current ? 'active' : '';
}

/**
 * Reads the last N Laravel log entries, grouping stacktraces up to $maxStackLines per entry.
 * Returns array of ['header' => ..., 'stack' => [..], 'raw' => ...]
 */
function readLaravelLogEntries($logPath, $maxStackLines = 3)
{
  if (!is_file($logPath)) return [];
  $lines = [];
  $entries = [];

  // Get last ~70K or all if smaller
  $f = fopen($logPath, 'r');
  if ($f) {
    $size = filesize($logPath);
    fseek($f, max(0, $size - 200000));
    while (($line = fgets($f)) !== false) {
      $lines[] = rtrim($line, "\r\n");
    }
    fclose($f);
  }

  // Parse entries: each starts with date [YYYY-MM-DD ...]
  $current = null;
  foreach ($lines as $line) {
    if (preg_match('/^\[(\d{4}-\d{2}-\d{2}) ([^\]]+)\] (\w+)\.([A-Z]+): (.*)$/', $line, $m)) {
      // [date time] env.LEVEL: message
      if ($current) $entries[] = $current;
      $current = [
        'header' => $line,
        'level' => $m[4],
        'env' => $m[3],
        'datetime' => $m[1] . ' ' . $m[2],
        'message' => $m[5],
        'stack' => [],
        'full_stack' => [],
      ];
    } elseif (isset($current)) {
      // Stack traces typically start with whitespace or #
      if ((preg_match('/^\s+/', $line) || strpos($line, '#') === 0)) {
        $current['full_stack'][] = $line;
        if (count($current['stack']) < $maxStackLines) {
          $current['stack'][] = $line;
        }
      } else {
        // Non-stack continuation (very rare, just append to message)
        $current['message'] .= "\n" . $line;
      }
    }
  }
  if ($current) $entries[] = $current;

  // Get only reversed: newest first
  return array_reverse($entries);
}

function getStatusHTML() {
  $php = phpversion();
  $dbStatus = 'Unknown';
  $dbType = 'N/A';

  try {
    $pdo = new PDO('mysql:host=localhost', 'root', '');
    $dbStatus = 'OK';
    $dbType = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
  } catch (Exception $e) {
    $dbStatus = 'Connection failed';
  }

  return <<<HTML
<div class="status">
  <strong>System Status</strong><br>
  PHP Version: {$php}<br>
  DB Connection: {$dbStatus}<br>
  DB Type: {$dbType}
</div>
HTML;
}
$envExists = file_exists(__DIR__ . '/../../.env');
$isMaintenanceOn = $envExists && str_contains(file_get_contents(__DIR__ . '/../../.env') ,'APP_SETUP_MODE=true')
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Maintenance Panel</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="header">
  <div class="logo">Astelium Maintenance</div>
  <div style="font-size: 0.97rem; font-weight: 400; opacity: 0.82;">Setup</div>
</div>
<div class="main-wrapper">
  <aside class="sidebar">
    <a class="menu-link <?= isActive('home') ?>" href="?view=home">Dashboard</a>
    <a class="menu-link <?= isActive('install') ?>" href="?view=install">Install</a>
    <a class="menu-link <?= isActive('support') ?>" href="?view=support">Support</a>
  </aside>
  <main class="main">
    <?php if ($current === 'install'): ?>
      <?php include 'install.php'; ?>

    <?php elseif ($current === 'support'): ?>
      <div class="panel">
        <div class="panel-title">Support</div>
        <p>Contact: <a href="mailto:support@astelium.com">support@astelium.com</a></p>
        <div style="margin-top:1.2rem;"><a href="?view=home" class="button button-secondary">Back</a></div>
      </div>

    <?php else: ?>
        <div class="dashboard-cards ">

          <!-- PHP Info Card -->
          <div class="dashboard-card">
            <div class="dashboard-card-title">PHP & Server</div>
            <table class="dashboard-card-table">
              <tr><td>PHP Version:</td><td><?= phpversion() ?></td></tr>
              <tr><td>OS:</td><td><?= php_uname('s') ?> (<?= php_uname('m') ?>)</td></tr>
              <tr><td>Web User:</td><td><?= get_current_user() ?></td></tr>
              <tr><td>Memory Limit:</td><td><?= ini_get('memory_limit') ?></td></tr>
            </table>
          </div>

          <!-- PHP Extensions Card (NEW) -->
          <div class="dashboard-card">
            <div class="dashboard-card-title">PHP Extensions</div>
            <table class="dashboard-card-table">
              <?php
              $laravelRequiredExt = [
                "openssl", "pdo", "mbstring", "tokenizer", "xml", "ctype", "json",
                "bcmath", "fileinfo", "curl", "gd", "intl", "zip"
              ];
              foreach ($laravelRequiredExt as $ext) {
                $enabled = extension_loaded($ext);
                $color = $enabled ? 'var(--success)' : 'var(--danger)';
                $status = $enabled ? 'Enabled' : 'Missing';
                echo "<tr>
                    <td>{$ext}</td>
                    <td style='color:$color;font-weight:500;'>$status</td>
                  </tr>";
              }
              ?>
            </table>
          </div>

          <!-- Laravel Info Card -->
          <div class="dashboard-card">
            <div class="dashboard-card-title">Laravel</div>
            <table class="dashboard-card-table">
              <tr>
                <td>Version:</td>
                <td>
                  <?php
                  $laravel = 'Unknown';
                  $verPath = __DIR__ . '/../../vendor/laravel/framework/src/Illuminate/Foundation/Application.php';
                  if (file_exists($verPath)) {
                    $verStr = file_get_contents($verPath, false, null, 0, 800);
                    if (preg_match("/const VERSION = '([^']+)'/", $verStr, $m)) $laravel = $m[1];
                  }
                  echo $laravel;
                  ?>
                </td>
              </tr>
              <tr>
                <td>.env File:</td>
                <td>
                  <?= $envExists ? '<span style="color: var(--success);font-weight:500;">Present</span>' : '<span style="color: var(--danger);font-weight:500;">Missing</span>' ?>
                </td>
              </tr>
              <tr>
                <td>Maintenance:</td>
                <td>
                  <?= $isMaintenanceOn ? 'ON':'Off' ?>
                </td>
              </tr>
            </table>
          </div>

          <!-- Database Card -->
          <div class="dashboard-card">
            <div class="dashboard-card-title">Database</div>
            <table class="dashboard-card-table">
              <?php
              try {
                $host = 'localhost';
                $user = 'root';
                $pass = '';
                $dsn = "mysql:host=$host";
                $pdo = new PDO($dsn, $user, $pass);

                // Queries for details
                $version = $pdo->query("SELECT VERSION()")->fetchColumn();
                $protocol = $pdo->query("SELECT @@protocol_version")->fetchColumn();
                $serverCharset = $pdo->query("SELECT @@character_set_server")->fetchColumn();
                $dbUser = $pdo->query("SELECT USER()")->fetchColumn();
                $hostName = $pdo->query("SELECT @@hostname")->fetchColumn();

                // SSL Check (simplified)
                $sslStatus = $pdo->query("SHOW STATUS LIKE 'Ssl_cipher'")->fetch(PDO::FETCH_ASSOC);
                $sslUsed = !empty($sslStatus['Value']);

                $dbStatus = '<span style="color: var(--success);font-weight:500;">OK</span>';
                $dbType = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
              } catch (Exception $e) {
                $dbStatus = '<span style="color: var(--danger);font-weight:500;">Failed</span>';
                $dbType = 'Unknown';
                $dbUser = '-';
                $version = $protocol = $serverCharset = $hostName = $sslUsed = '-';
              }
              ?>
              <tr><td>Status:</td><td><?= $dbStatus ?></td></tr>
              <tr><td>Server:</td><td><?= htmlspecialchars($hostName) ?> via TCP/IP</td></tr>
              <tr><td>Server type:</td><td><?= $dbType ?></td></tr>
              <tr><td>Server version:</td><td><?= htmlspecialchars($version) ?></td></tr>
              <tr><td>Protocol version:</td><td><?= htmlspecialchars($protocol) ?></td></tr>
              <tr><td>User:</td><td><?= htmlspecialchars($dbUser) ?></td></tr>
              <tr><td>Server charset:</td><td><?= htmlspecialchars($serverCharset) ?></td></tr>
              <tr><td>SSL:</td><td><?= $sslUsed ? 'Used' : 'Not used' ?></td></tr>
            </table>
          </div>

          <!-- Filesystem Card -->
          <div class="dashboard-card">
            <div class="dashboard-card-title">Filesystem</div>
            <table class="dashboard-card-table">
              <tr>
                <td>App Root:</td>
                <td><?= dirname(__DIR__, 2) ?></td>
              </tr>
              <tr>
                <td>Free Space:</td>
                <td>
                  <?php
                  $free = disk_free_space(__DIR__);
                  echo number_format($free / 1073741824, 2) . ' GB';
                  ?>
                </td>
              </tr>
              <tr>
                <td>Storage:</td>
                <td>
                  <?php
                  $storage = realpath(__DIR__ . '/../../storage');
                  echo $storage && is_dir($storage) ? $storage : 'Not found';
                  ?>
                </td>
              </tr>
            </table>
          </div>

        </div>
        <?php
        // Laravel Log Card
        $logPath = realpath(__DIR__ . '/../../storage/logs/laravel.log');
        if ($logPath && is_file($logPath)) {
          if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['clear_log'])) {
            file_put_contents($logPath, '');
            // Optionally, you can display a quick notice
            $logCleared = true;
          }
          $logEntries = readLaravelLogEntries($logPath, 3);
          ?>
          <div class="dashboard-card" style="margin-top:1.3rem;width: 100%;
  box-sizing: border-box;">
            <div class="dashboard-card-title" style="margin-bottom:0.3rem;">
              Laravel Log <span style="font-weight:400;color:#8ea0bb;">(last 100 entries)</span>
            </div>
            <div class="log-actions">
              <button type="button" onclick="copyLog()">Copy All</button>
              <form method="post" style="display:inline;margin:0;padding:0;">
                <button type="submit" name="clear_log" value="1" style="background:#e04e4e;margin-left:0.5rem;">Clear Log</button>
              </form>
            </div>
            <table class="log-table" style="max-height: 40vh;overflow-y: scroll;display: block;">
              <?php foreach ($logEntries as $i => $entry):
                $level = strtolower($entry['level']);
                $levelClass = "log-level ";
                if (in_array($level, ['error', 'critical', 'alert', 'emergency'])) $levelClass .= "log-error";
                elseif (in_array($level, ['warning', 'warn'])) $levelClass .= "log-warning";
                elseif ($level === 'info') $levelClass .= "log-info";
                else $levelClass .= "log-debug";
                ?>
                <tr class="log-table-row" onclick="toggleLogDetail(<?= $i ?>)">
                  <td class="log-table-cell" style="width:1%;">
                    <span class="<?= $levelClass ?>"><?= htmlspecialchars(strtoupper($entry['level'])) ?></span>
                  </td>
                  <td class="log-table-cell" style="width:1%;color:#8ea0bb;"><?= htmlspecialchars($entry['datetime']) ?></td>
                  <td class="log-table-cell" style="color:#1a2237;max-width:420px;overflow:hidden;text-overflow:ellipsis;">
                    <?= nl2br(htmlspecialchars($entry['message'])) ?>
                  </td>
                </tr>
                <tr class="log-details-row" id="log-detail-<?= $i ?>" style="display:none;">
                  <td colspan="3" class="log-details-cell">
                    <div style="margin-bottom:0.5em;">
                      <span style="font-size:0.97em;font-weight:600;color:#7de5bc;">Env:</span> <?= htmlspecialchars($entry['env']) ?>
                    </div>
                    <div>
                      <span style="font-size:0.97em;font-weight:600;color:#bcb1ff;">Header:</span> <?= htmlspecialchars($entry['header']) ?>
                    </div>
                    <?php if (!empty($entry['full_stack'])): ?>
                      <div style="margin-top:0.6em;">
                        <span style="font-weight:600;color:#f9b68a;">Stack Trace:</span>
                        <pre style="margin:0.35em 0 0 0;background:none;border:none;"><?= htmlspecialchars(implode("\n", $entry['full_stack'])) ?></pre>
                      </div>
                    <?php endif; ?>
                  </td>
                </tr>
              <?php endforeach; ?>
            </table>
            <script>
              function copyLog() {
                var logs = Array.from(document.querySelectorAll('.log-table-row, .log-details-cell'))
                  .map(el => el.innerText).join("\n\n");
                navigator.clipboard.writeText(logs).then(function() {
                  alert('Log copied to clipboard.');
                });
              }
              function toggleLogDetail(i) {
                var el = document.getElementById('log-detail-' + i);
                if (!el) return;
                var isOpen = el.style.display === 'table-row';
                // Close all others
                document.querySelectorAll('.log-details-row').forEach(e => e.style.display = 'none');
                document.querySelectorAll('.log-table-row').forEach(e => e.classList.remove('active'));
                // Open this one if it was not already open
                if (!isOpen) {
                  el.style.display = 'table-row';
                  // highlight row
                  el.previousElementSibling.classList.add('active');
                }
              }
            </script>
          </div>
        <?php } ?>
        <form method="post" style="margin-top:1.5rem;">
          <div class="button-row">
            <?php
            if(function_exists('passthru')): ?>
              <button type="submit" name="artisan" value="1">PHP: Artisan Reset</button>
              <button type="submit" name="dbreset" value="1">PHP: DB Reset + Seed</button>
            <?php
            endif;
            ?>

            <?php
            if($isMaintenanceOn):
            ?>
              <button type="button" onclick="runCommand('clear')">Clear Cache</button>
              <button type="button" onclick="runCommand('migrate')">Migrate</button>
              <button type="button" onclick="runCommand('migrate-fresh')">Migrate Fresh</button>
              <button type="button" onclick="runCommand('seed-example')">Example Data</button>
              <button type="button" onclick="runCommand('stop')">Maintenance Off</button>
            <?php
            endif;
            ?>
          </div>
        </form>

      <pre id="output" style="white-space: pre-wrap; background: #eee; padding: 10px;"></pre>

      <script>
        async function runCommand(type) {
          const res = await fetch(`../api/maintenance/${type}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': getCookieValue('XSRF-TOKEN'),
            },
            credentials: 'same-origin',
          });

          const json = await res.json();
          document.getElementById('output').textContent = json.output || json.message;
          return false;
        }

        function getCookieValue(name) {
          return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
        }
      </script>

      <?php
        $appRoot = realpath(__DIR__ . '/../..');

        if ($_POST['artisan'] ?? false) {
          echo "<pre>";
          passthru("php {$appRoot}/artisan config:clear 2>&1"); // ⬅ Add this line
          passthru("php {$appRoot}/artisan cache:clear 2>&1"); // ⬅ Add this line
          passthru("php {$appRoot}/artisan route:clear 2>&1"); // ⬅ Add this line
          passthru("php {$appRoot}/artisan view:clear 2>&1"); // ⬅ Add this line
          passthru("php {$appRoot}/artisan config:cache 2>&1"); // ⬅ Add this line

          echo "\n✅ Artisan reset completed.";
          echo "</pre>";
        }
        if ($_POST['dbreset'] ?? false) {
          echo "<pre>";
          passthru("php {$appRoot}/artisan migrate:fresh --seed"); // ⬅ Add this line
          echo "\n✅ Database reset and seeded.";
          echo "</pre>";
        }
        ?>
    <?php endif; ?>
  </main>
</div>
</body>
</html>
