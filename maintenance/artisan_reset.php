<?php
passthru('php artisan config:clear');
passthru('php artisan cache:clear');
passthru('php artisan route:clear');
passthru('php artisan view:clear');
passthru('php artisan config:cache');
echo "✅ Artisan reset completed.";
