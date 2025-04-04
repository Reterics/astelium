<?php
namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AppointmentResource;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::all();
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
        ]);

        $appointment = Appointment::create($validated);
        return (new AppointmentResource($appointment))->toArray($request);
    }

    public function show(Appointment $appointment): AppointmentResource
    {
        return new AppointmentResource($appointment);
    }

    public function destroy(Appointment $appointment): \Illuminate\Http\JsonResponse
    {
        $appointment->delete();
        return response()->json(['message' => 'Appointment deleted']);
    }
}
