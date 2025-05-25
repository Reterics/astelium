<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentReminder;
use App\Notifications\AppointmentUpdate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send a reminder for an upcoming appointment
     *
     * @param Appointment $appointment
     * @param int $hoursBeforeAppointment
     * @return void
     */
    public function sendAppointmentReminder(Appointment $appointment, int $hoursBeforeAppointment = 24)
    {
        try {
            // Get the user associated with the appointment
            $user = $appointment->user;

            if (!$user) {
                Log::warning("Cannot send reminder: No user associated with appointment ID {$appointment->id}");
                return;
            }

            // Send the notification
            $user->notify(new AppointmentReminder($appointment, $hoursBeforeAppointment));

            Log::info("Appointment reminder sent to user {$user->id} for appointment {$appointment->id} ({$hoursBeforeAppointment} hours before)");
        } catch (\Exception $e) {
            Log::error("Failed to send appointment reminder: " . $e->getMessage(), [
                'appointment_id' => $appointment->id,
                'hours_before' => $hoursBeforeAppointment,
                'exception' => $e
            ]);
        }
    }

    /**
     * Send a notification about an appointment update
     *
     * @param Appointment $appointment
     * @param array $changes
     * @return void
     */
    public function sendAppointmentUpdateNotification(Appointment $appointment, array $changes = [])
    {
        try {
            // Get the user associated with the appointment
            $user = $appointment->user;

            if (!$user) {
                Log::warning("Cannot send update notification: No user associated with appointment ID {$appointment->id}");
                return;
            }

            // Send the notification
            $user->notify(new AppointmentUpdate($appointment, $changes));

            Log::info("Appointment update notification sent to user {$user->id} for appointment {$appointment->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send appointment update notification: " . $e->getMessage(), [
                'appointment_id' => $appointment->id,
                'changes' => $changes,
                'exception' => $e
            ]);
        }
    }

    /**
     * Schedule reminders for all upcoming appointments
     *
     * @param array $reminderHours Array of hours before appointment to send reminders
     * @return int Number of reminders scheduled
     */
    public function scheduleAppointmentReminders(array $reminderHours = [48, 24, 1])
    {
        $count = 0;
        $now = Carbon::now();

        // Get appointments in the future that haven't had all reminders sent
        $appointments = Appointment::where('day', '>=', $now->format('Y-m-d'))
            ->get();

        foreach ($appointments as $appointment) {
            // Parse the appointment date and time
            $appointmentDateTime = Carbon::parse($appointment->day . ' ' . $appointment->time);

            // Get hours until appointment
            $hoursUntilAppointment = $now->diffInHours($appointmentDateTime);

            // Check if we need to send any reminders based on the configured reminder hours
            foreach ($reminderHours as $hours) {
                $reminderKey = 'reminder_' . $hours . 'h_sent';

                // If this specific reminder hasn't been sent yet and it's time to send it
                // We use a small buffer (0.5 hour) to catch appointments that are just past the exact hour mark
                if (
                    !$appointment->$reminderKey &&
                    $hoursUntilAppointment <= $hours &&
                    $hoursUntilAppointment > ($hours - 0.5)
                ) {
                    $this->sendAppointmentReminder($appointment, $hours);

                    // Mark this specific reminder as sent
                    $appointment->$reminderKey = true;
                    $appointment->save();

                    $count++;

                    // Also mark the general reminder_sent field as true for backward compatibility
                    if (!$appointment->reminder_sent) {
                        $appointment->reminder_sent = true;
                        $appointment->save();
                    }
                }
            }
        }

        return $count;
    }
}
