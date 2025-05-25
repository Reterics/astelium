<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for upcoming appointments';

    /**
     * Execute the console command.
     */
    public function handle(NotificationService $notificationService)
    {
        $this->info('Starting to send appointment reminders...');

        try {
            $count = $notificationService->scheduleAppointmentReminders();

            $this->info("Successfully sent {$count} appointment reminders.");
            Log::info("Appointment reminder command completed. Sent {$count} reminders.");
        } catch (\Exception $e) {
            $this->error('Failed to send appointment reminders: ' . $e->getMessage());
            Log::error('Failed to send appointment reminders: ' . $e->getMessage(), [
                'exception' => $e
            ]);
        }

        return Command::SUCCESS;
    }
}
