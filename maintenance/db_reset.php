<?php
passthru('php artisan migrate:fresh --seed');
echo "✅ Database migrated and seeded successfully.";
