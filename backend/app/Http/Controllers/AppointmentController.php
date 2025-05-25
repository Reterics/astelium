<?php
namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AppointmentResource;

class AppointmentController extends Controller
{
    /**
     * Get available time slots based on service type.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAvailableTimeSlots(Request $request)
    {
        $validated = $request->validate([
            'service_type' => 'required|string',
            'day' => 'required|string',
            'shift_start' => 'nullable|string',
            'shift_end' => 'nullable|string',
        ]);

        $serviceType = $validated['service_type'];
        $day = $validated['day'];
        $shiftStart = $validated['shift_start'] ?? '09:00';
        $shiftEnd = $validated['shift_end'] ?? '18:00';

        // Get all appointments for the specified day and service type
        $appointments = Appointment::where('day', $day)
            ->where(function($query) use ($serviceType) {
                $query->where('service_type', $serviceType)
                      ->orWhereNull('service_type');
            })
            ->get();

        // Generate all possible time slots for the day
        $allTimeSlots = $this->generateTimeSlots($shiftStart, $shiftEnd, 30); // 30-minute intervals

        // Filter out booked time slots
        $availableTimeSlots = array_filter($allTimeSlots, function($timeSlot) use ($appointments) {
            foreach ($appointments as $appointment) {
                if ($appointment->time === $timeSlot) {
                    return false;
                }
            }
            return true;
        });

        return response()->json([
            'available_time_slots' => array_values($availableTimeSlots),
            'service_type' => $serviceType,
            'day' => $day,
        ]);
    }

    /**
     * Generate time slots between start and end times.
     *
     * @param string $startTime
     * @param string $endTime
     * @param int $intervalMinutes
     * @return array
     */
    private function generateTimeSlots($startTime, $endTime, $intervalMinutes = 30)
    {
        $timeSlots = [];
        $startDateTime = \DateTime::createFromFormat('H:i', $startTime);
        $endDateTime = \DateTime::createFromFormat('H:i', $endTime);
        $interval = new \DateInterval('PT' . $intervalMinutes . 'M');

        while ($startDateTime < $endDateTime) {
            $timeSlots[] = $startDateTime->format('H:i');
            $startDateTime->add($interval);
        }

        return $timeSlots;
    }
    /**
     * Create a new appointment without requiring authentication.
     * This allows public users to book appointments.
     *
     * @param Request $request
     * @return array
     */
    public function publicStore(Request $request): array
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'time' => 'required|string',
            'length' => 'required|integer|in:30,60,90',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'comments' => 'nullable|string',
            'service_type' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        // Check for double-booking
        $existingAppointment = Appointment::where('day', $validated['day'])
            ->where('time', $validated['time'])
            ->first();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'This time slot is already booked.',
                'errors' => [
                    'time' => ['This time slot is already booked.']
                ]
            ], 422)->getData(true);
        }

        // Set default status for public appointments
        $validated['status'] = 'pending';

        $appointment = Appointment::create($validated);
        return (new AppointmentResource($appointment))->toArray($request);
    }
    public function index(Request $request)
    {
        // If user is authenticated, filter appointments by user_id
        if (Auth::check()) {
            $user = Auth::user();

            // If user is admin, return all appointments
            if ($user->role === 'admin') {
                $appointments = Appointment::all();
            } else {
                // For regular users, only return their appointments
                $appointments = Appointment::where('user_id', $user->id)->get();
            }
        } else {
            // For unauthenticated users, return all appointments
            // This is needed for availability checking
            $appointments = Appointment::all();
        }

        return AppointmentResource::collection($appointments)->toArray($request);
    }

    public function store(Request $request): array
    {
        $validated = $request->validate([
            'day' => 'required|string',
            'time' => 'required|string',
            'length' => 'required|integer|in:30,60,90',
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'comments' => 'nullable|string',
            'status' => 'nullable|string',
            'service_type' => 'nullable|string',
            'location' => 'nullable|string',
            'recurrence' => 'nullable|array',
            'assigned_to' => 'nullable|integer',
        ]);

        // Check for double-booking
        $existingAppointment = Appointment::where('day', $validated['day'])
            ->where('time', $validated['time'])
            ->first();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'This time slot is already booked.',
                'errors' => [
                    'time' => ['This time slot is already booked.']
                ]
            ], 422)->getData(true);
        }

        // Associate the appointment with the authenticated user
        if (Auth::check()) {
            $validated['user_id'] = Auth::id();
        }

        $appointment = Appointment::create($validated);
        return (new AppointmentResource($appointment))->toArray($request);
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        return new AppointmentResource($appointment);
    }

    public function update(Request $request, Appointment $appointment): array
    {
        $validated = $request->validate([
            'day' => 'sometimes|required|string',
            'time' => 'sometimes|required|string',
            'length' => 'sometimes|required|integer|in:30,60,90',
            'name' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'comments' => 'nullable|string',
            'status' => 'nullable|string',
            'service_type' => 'nullable|string',
            'location' => 'nullable|string',
            'recurrence' => 'nullable|array',
            'assigned_to' => 'nullable|integer',
            'user_id' => 'nullable|integer',
        ]);

        // Check for double-booking only if day or time is being updated
        if (isset($validated['day']) || isset($validated['time'])) {
            $day = $validated['day'] ?? $appointment->day;
            $time = $validated['time'] ?? $appointment->time;

            // Check if there's another appointment at the same time (excluding this one)
            $existingAppointment = Appointment::where('day', $day)
                ->where('time', $time)
                ->where('id', '!=', $appointment->id)
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'message' => 'This time slot is already booked.',
                    'errors' => [
                        'time' => ['This time slot is already booked.']
                    ]
                ], 422)->getData(true);
            }
        }

        $appointment->update($validated);
        return (new AppointmentResource($appointment))->toArray($request);
    }

    public function destroy(Appointment $appointment): \Illuminate\Http\JsonResponse
    {
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted']);
    }
}
