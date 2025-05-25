<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $appointment;
    protected $hoursBeforeAppointment;

    /**
     * Create a new notification instance.
     *
     * @param Appointment $appointment
     * @param int $hoursBeforeAppointment
     * @return void
     */
    public function __construct(Appointment $appointment, int $hoursBeforeAppointment = 24)
    {
        $this->appointment = $appointment;
        $this->hoursBeforeAppointment = $hoursBeforeAppointment;
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

        $subject = $this->hoursBeforeAppointment <= 24
            ? 'Appointment Reminder: Tomorrow'
            : 'Appointment Reminder: ' . $this->hoursBeforeAppointment . ' hours before';

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a reminder for your upcoming appointment.')
            ->line('Date: ' . $this->appointment->day)
            ->line('Time: ' . $this->appointment->time)
            ->line('Duration: ' . $this->appointment->length . ' minutes')
            ->when($this->appointment->location, function ($message) {
                return $message->line('Location: ' . $this->appointment->location);
            })
            ->when($this->appointment->service_type, function ($message) {
                return $message->line('Service: ' . $this->appointment->service_type);
            })
            ->action('View Appointment', $url)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $data = [
            'appointment_id' => $this->appointment->id,
            'day' => $this->appointment->day,
            'time' => $this->appointment->time,
            'length' => $this->appointment->length,
            'hours_before' => $this->hoursBeforeAppointment,
            'type' => 'reminder',
            'message' => 'You have an upcoming appointment on ' . $this->appointment->day . ' at ' . $this->appointment->time,
        ];

        if ($this->appointment->location) {
            $data['location'] = $this->appointment->location;
        }

        if ($this->appointment->service_type) {
            $data['service_type'] = $this->appointment->service_type;
        }

        return $data;
    }
}
