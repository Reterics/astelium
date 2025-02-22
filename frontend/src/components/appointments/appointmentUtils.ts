import {TFunction} from 'i18next';
import {useEffect, useState} from 'react';
import {generateTimeSlots} from '../../utils/dateUtils.ts';
import {CrudField} from '../CrudManager.tsx';
import {TimeSlot} from './AppointmentCalendar.tsx';

export const useAppointmentFields = (
  t: TFunction,
  appointments: TimeSlot[],
  shift: string[] = ['09:00', '17:00'],
  selectedDateString?: string
) => {
  const [date, setDate] = useState<string | undefined>(selectedDateString);

  const availableTimes = generateTimeSlots(
    appointments
      .filter((appointment) => date === appointment.day)
      .map((appointment) => appointment.time as string),
    shift
  ).filter((times) => !times.booked);

  useEffect(() => {
    setDate(selectedDateString);
  }, [selectedDateString]);

  return {
    fields: [
      {key: 'name', label: t('name'), type: 'text'},

      {key: 'day', label: t('date'), type: 'date'},
      {
        key: 'time',
        label: t('time'),
        type: 'select',
        options: availableTimes.map((a) => ({value: a.time, label: a.time})),
      },
      {
        key: 'length',
        label: t('length'),
        type: 'select',
        options: ['30', '60', '90'].map((e) => ({value: e, label: e})),
      },
      {key: 'email', label: t('email'), type: 'text'},
      {key: 'phone', label: t('phone'), type: 'text'},
      {key: 'comments', label: t('comments'), type: 'text'},
    ] as CrudField[],
    onInputChange: (key: string, form: Record<string, unknown>) => {
      if (key === 'day') {
        setDate(form.day as string);
      }
    },
  };
};
