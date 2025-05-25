<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentUpdate extends Notification implements ShouldQueue
{
    use Queueable;

    protected $appointment;
    protected $changes;

    /**
     * Create a new notification instance.
     *
     * @param Appointment $appointment
     * @param array $changes
     * @return void
     */
    public function __construct(Appointment $appointment, array $changes = [])
    {
        $this->appointment = $appointment;
        $this->changes = $changes;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = url('/appointments/' . $this->appointment->id);
        $message = (new MailMessage)
            ->subject('Appointment Update')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your appointment has been updated.');

        // Add details about what changed
        if (!empty($this->changes)) {
            $message->line('The following details have been changed:');
            foreach ($this->changes as $field => $newValue) {
                $message->line($field . ': ' . $newValue);
            }
        }

        // Add current appointment details
        $message->line('Current appointment details:')
            ->line('Date: ' . $this->appointment->day)
            ->line('Time: ' . $this->appointment->time)
            ->line('Duration: ' . $this->appointment->length . ' minutes')
            ->action('View Appointment', $url)
            ->line('Thank you for using our application!');

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'appointment_id' => $this->appointment->id,
            'day' => $this->appointment->day,
            'time' => $this->appointment->time,
            'length' => $this->appointment->length,
            'type' => 'update',
            'changes' => $this->changes,
            'message' => 'Your appointment on ' . $this->appointment->day . ' at ' . $this->appointment->time . ' has been updated.',
        ];
    }
}
