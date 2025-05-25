import {TFunction} from 'i18next';
import {useEffect, useState} from 'react';
import {generateTimeSlots} from '../../utils/dateUtils.ts';
import {CrudField} from '../CrudManager.tsx';
import {TimeSlot} from './client/ClientAppointmentCalendar.tsx';
import {AppointmentStatus, RecurrenceType} from '../../models/Appointment.ts';
import {
  validateEmail,
  validateName,
  validatePhone,
} from '../../utils/validationUtils.ts';

interface AppointmentFieldOptions {
  timeOptions?: {value: string; label: string}[];
  serviceType?: string;
}

export const useAppointmentFields = (
  t: TFunction,
  appointments: TimeSlot[],
  shift: string[] = ['09:00', '17:00'],
  selectedDateString?: string,
  isAdmin: boolean = false,
  options?: AppointmentFieldOptions
) => {
  const [date, setDate] = useState<string | undefined>(selectedDateString);
  const [showRecurrence, setShowRecurrence] = useState<boolean>(false);

  const availableTimes = generateTimeSlots(
    appointments
      .filter((appointment) => date === appointment.day)
      .map((appointment) => appointment.time as string),
    shift
  ).filter((times) => !times.booked);

  useEffect(() => {
    setDate(selectedDateString);
  }, [selectedDateString]);

  // Basic fields for all appointment forms
  const basicFields: CrudField[] = [
    // Section for appointment details
    {
      key: 'appointmentSection',
      label: t('appointment_details'),
      type: 'section',
    },
    {key: 'day', label: t('date'), type: 'date', required: true},
    {
      key: 'time',
      label: t('time'),
      type: 'select',
      options:
        options?.timeOptions ||
        availableTimes.map((a) => ({value: a.time, label: a.time})),
      required: true,
      placeholder: t('select_time'),
    },
    {
      key: 'length',
      label: t('duration'),
      type: 'select',
      options: ['30', '60', '90', '120'].map((e) => ({
        value: e,
        label: `${e} ${t('minutes')}`,
      })),
      required: true,
      defaultValue:
        options?.serviceType === 'consultation'
          ? '30'
          : options?.serviceType === 'treatment'
            ? '60'
            : options?.serviceType === 'followup'
              ? '30'
              : '30',
    },
    {
      key: 'serviceType',
      label: t('service_type'),
      type: 'select',
      options: [
        {value: 'consultation', label: t('consultation')},
        {value: 'treatment', label: t('treatment')},
        {value: 'followup', label: t('followup')},
      ],
      defaultValue: options?.serviceType || 'consultation',
      required: true,
    },

    // Section for client information
    {key: 'clientSection', label: t('your_information'), type: 'section'},
    {
      key: 'name',
      label: t('name'),
      type: 'text',
      required: true,
      placeholder: t('enter_your_name'),
      validate: (value) => validateName(value as string),
    },
    {
      key: 'email',
      label: t('email'),
      type: 'text',
      required: true,
      placeholder: t('enter_your_email'),
      validate: (value) => validateEmail(value as string),
    },
    {
      key: 'phone',
      label: t('phone'),
      type: 'text',
      placeholder: t('enter_your_phone'),
      validate: (value) => validatePhone(value as string),
    },
  ];

  // Admin-only fields
  const adminFields: CrudField[] = isAdmin
    ? [
        {key: 'adminSection', label: t('admin_settings'), type: 'section'},
        {
          key: 'status',
          label: t('status'),
          type: 'select',
          options: [
            {value: AppointmentStatus.PENDING, label: t('pending')},
            {value: AppointmentStatus.CONFIRMED, label: t('confirmed')},
            {value: AppointmentStatus.CANCELED, label: t('canceled')},
            {value: AppointmentStatus.COMPLETED, label: t('completed')},
          ],
          defaultValue: AppointmentStatus.PENDING,
        },
        {
          key: 'location',
          label: t('location'),
          type: 'text',
          placeholder: t('enter_location'),
        },
        {
          key: 'assignedTo',
          label: t('assigned_to'),
          type: 'text',
          placeholder: t('enter_staff_name'),
        },
      ]
    : [];

  // Recurrence fields
  const recurrenceToggleField: CrudField[] = [
    {key: 'recurrenceSection', label: t('recurrence_options'), type: 'section'},
    {
      key: 'isRecurring',
      label: t('recurring_appointment'),
      type: 'checkbox',
      props: {
        onChange: (value: unknown) => {
          setShowRecurrence(value as boolean);
        },
      },
      help: t('recurring_appointment_help'),
    },
  ];

  const recurrenceFields: CrudField[] = showRecurrence
    ? [
        {
          key: 'recurrenceType',
          label: t('recurrence_type'),
          type: 'select',
          options: [
            {value: RecurrenceType.DAILY, label: t('daily')},
            {value: RecurrenceType.WEEKLY, label: t('weekly')},
            {value: RecurrenceType.MONTHLY, label: t('monthly')},
            {value: RecurrenceType.YEARLY, label: t('yearly')},
          ],
          defaultValue: RecurrenceType.WEEKLY,
          required: true,
        },
        {
          key: 'recurrenceInterval',
          label: t('recurrence_interval'),
          type: 'number',
          min: 1,
          max: 30,
          defaultValue: 1,
          required: true,
          help: t('recurrence_interval_help'),
        },
        {
          key: 'recurrenceEndType',
          label: t('recurrence_end'),
          type: 'select',
          options: [
            {value: 'never', label: t('never')},
            {value: 'after', label: t('after_occurrences')},
            {value: 'on', label: t('on_date')},
          ],
          defaultValue: 'after',
          required: true,
        },
        {
          key: 'recurrenceEndAfter',
          label: t('occurrences'),
          type: 'number',
          min: 1,
          max: 52,
          defaultValue: 10,
          required: true,
          visible: (form) => form.recurrenceEndType === 'after',
        },
        {
          key: 'recurrenceEndDate',
          label: t('end_date'),
          type: 'date',
          required: true,
          visible: (form) => form.recurrenceEndType === 'on',
        },
      ]
    : [];

  // Notes field
  const notesField: CrudField[] = [
    {
      key: 'additionalSection',
      label: t('additional_information'),
      type: 'section',
    },
    {
      key: 'comments',
      label: t('comments'),
      type: 'textarea',
      placeholder: t('enter_any_additional_information'),
      rows: 3,
    },
  ];

  return {
    fields: [
      ...basicFields,
      ...adminFields,
      ...recurrenceToggleField,
      ...recurrenceFields,
      ...notesField,
    ],
    onInputChange: (key: string, form: Record<string, unknown>) => {
      if (key === 'day') {
        setDate(form.day as string);
      }
      if (key === 'isRecurring') {
        setShowRecurrence(form.isRecurring as boolean);
      }
    },
  };
};
