/**
 * Comprehensive appointment data model with support for recurring appointments
 */

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number; // Every X days/weeks/months/years
  endDate?: string; // ISO date string for when recurrence ends
  endAfterOccurrences?: number; // End after X occurrences
  daysOfWeek?: number[]; // For weekly recurrence (0 = Sunday, 6 = Saturday)
  dayOfMonth?: number; // For monthly recurrence
  monthOfYear?: number; // For yearly recurrence (0 = January, 11 = December)
  exceptions?: string[]; // ISO date strings for dates to exclude
}

export interface Appointment {
  id?: number;
  title?: string;
  description?: string;
  startDate: string; // ISO date string
  startTime: string; // HH:MM format
  endTime?: string; // HH:MM format
  duration: number; // In minutes
  status: AppointmentStatus;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType?: string;
  location?: string;
  notes?: string;
  recurrence?: RecurrenceRule;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  createdBy?: number; // User ID
  assignedTo?: number; // User ID
}

/**
 * Convert legacy TimeSlot to new Appointment model
 */
export function convertTimeSlotToAppointment(timeSlot: any): Appointment {
  return {
    id: timeSlot.id,
    title: `Appointment with ${timeSlot.name}`,
    description: timeSlot.comments,
    startDate: timeSlot.day || new Date().toISOString().split('T')[0],
    startTime: timeSlot.time || '09:00',
    duration: parseInt(timeSlot.length || '30', 10),
    status: AppointmentStatus.PENDING,
    clientName: timeSlot.name || '',
    clientEmail: timeSlot.email || '',
    clientPhone: timeSlot.phone,
    notes: timeSlot.comments,
    recurrence: {
      type: RecurrenceType.NONE,
      interval: 1,
    },
  };
}

/**
 * Convert new Appointment model to legacy TimeSlot
 */
export function convertAppointmentToTimeSlot(appointment: Appointment): any {
  return {
    id: appointment.id,
    day: appointment.startDate,
    time: appointment.startTime,
    length: appointment.duration.toString(),
    name: appointment.clientName,
    email: appointment.clientEmail,
    phone: appointment.clientPhone,
    comments: appointment.notes,
    status: appointment.status,
  };
}

/**
 * Generate all occurrence dates for a recurring appointment
 */
export function generateRecurrenceOccurrences(
  appointment: Appointment,
  startDate: Date,
  endDate: Date
): Date[] {
  const occurrences: Date[] = [];
  const recurrence = appointment.recurrence;

  if (!recurrence || recurrence.type === RecurrenceType.NONE) {
    const appointmentDate = new Date(appointment.startDate);
    if (appointmentDate >= startDate && appointmentDate <= endDate) {
      occurrences.push(appointmentDate);
    }
    return occurrences;
  }

  let currentDate = new Date(appointment.startDate);
  const recurrenceEndDate = recurrence.endDate
    ? new Date(recurrence.endDate)
    : new Date(endDate);

  let occurrenceCount = 0;
  const maxOccurrences = recurrence.endAfterOccurrences || 100; // Limit to prevent infinite loops

  while (currentDate <= recurrenceEndDate && occurrenceCount < maxOccurrences) {
    if (currentDate >= startDate && currentDate <= endDate) {
      // Check if this date is not in exceptions
      const dateString = currentDate.toISOString().split('T')[0];
      if (!recurrence.exceptions?.includes(dateString)) {
        occurrences.push(new Date(currentDate));
      }
    }

    // Calculate next occurrence based on recurrence type
    switch (recurrence.type) {
      case RecurrenceType.DAILY:
        currentDate.setDate(currentDate.getDate() + recurrence.interval);
        break;
      case RecurrenceType.WEEKLY:
        if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
          // Find the next day of week in the recurrence pattern
          let found = false;
          for (let i = 1; i <= 7; i++) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + i);
            if (recurrence.daysOfWeek.includes(nextDay.getDay())) {
              currentDate = nextDay;
              found = true;
              break;
            }
          }
          if (!found) {
            // If no matching day found, move to next week
            currentDate.setDate(
              currentDate.getDate() + 7 * recurrence.interval
            );
          }
        } else {
          // Simple weekly recurrence
          currentDate.setDate(currentDate.getDate() + 7 * recurrence.interval);
        }
        break;
      case RecurrenceType.MONTHLY:
        if (recurrence.dayOfMonth) {
          // Set to specific day of month
          currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
          currentDate.setDate(
            Math.min(
              recurrence.dayOfMonth,
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                0
              ).getDate()
            )
          );
        } else {
          // Same day of month
          currentDate.setMonth(currentDate.getMonth() + recurrence.interval);
        }
        break;
      case RecurrenceType.YEARLY:
        if (recurrence.monthOfYear !== undefined && recurrence.dayOfMonth) {
          // Set to specific month and day
          currentDate.setFullYear(
            currentDate.getFullYear() + recurrence.interval
          );
          currentDate.setMonth(recurrence.monthOfYear);
          currentDate.setDate(
            Math.min(
              recurrence.dayOfMonth,
              new Date(
                currentDate.getFullYear(),
                recurrence.monthOfYear + 1,
                0
              ).getDate()
            )
          );
        } else {
          // Same month and day
          currentDate.setFullYear(
            currentDate.getFullYear() + recurrence.interval
          );
        }
        break;
    }

    occurrenceCount++;
  }

  return occurrences;
}
