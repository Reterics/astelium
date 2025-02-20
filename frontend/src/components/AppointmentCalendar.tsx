import {useEffect, useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import {useApi} from '../hooks/useApi.ts';
import FormModal from '../components/FormModal.tsx';
import SelectComponent from '../components/SelectComponent.tsx';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {CrudField} from './CrudManager.tsx';
import {generateTimeSlots, getFormattedDate} from '../utils/dateUtils.ts';

const defaultTimeSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
];

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface TimeSlot {
  time?: string;
  day?: string;
  length?: string;
  name?: string;
  phone?: string;
  email?: string;
  comments?: string;
}

const useAppointmentFields = (
  appointments: Record<string, unknown>[],
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
      {key: 'day', label: 'Date', type: 'date'},
      {
        key: 'time',
        label: 'Time',
        type: 'select',
        options: availableTimes.map((a) => ({value: a.time, label: a.time})),
      },
      {
        key: 'length',
        label: 'Length (minutes)',
        type: 'select',
        options: ['30', '60', '90'].map((e) => ({value: e, label: e})),
      },
      {key: 'name', label: 'Name', type: 'text'},
      {key: 'email', label: 'Email', type: 'text'},
      {key: 'phone', label: 'Phone', type: 'text'},
      {key: 'comments', label: 'Comments', type: 'text'},
    ] as CrudField[],
    onInputChange: (key: string, form: Record<string, unknown>) => {
      if (key === 'date') {
        setDate(form.date as string);
      }
    },
  };
};

const AppointmentCalendar = () => {
  const {
    data: appointments,
    isLoading,
    createMutation,
  } = useApi('appointments');
  const [selectedSlot, setSelectedSlot] = useState<null | TimeSlot>(null);
  const [modalData, setModalData] = useState<false | Record<string, unknown>>(
    false
  );
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [mode, setMode] = useState<'month' | 'week'>('month');

  const handleSelect = (day: string, time: string) => {
    setSelectedSlot({day, time});
    setModalData({day, time});
  };

  const saveAppointment = async (form: TimeSlot) => {
    await createMutation.mutateAsync(form);
    setModalData(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedWeek);
  const firstDay = getFirstDayOfMonth(selectedWeek);

  const onLeft = () => {
    if (mode === 'month') {
      setSelectedWeek((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
    } else if (mode === 'week') {
      setSelectedWeek((prev) => new Date(prev.setDate(prev.getDate() - 7)));
    }
  };

  const onRight = () => {
    if (mode === 'month') {
      setSelectedWeek((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
    } else if (mode === 'week') {
      setSelectedWeek((prev) => new Date(prev.setDate(prev.getDate() + 7)));
    }
  };

  const appointmentFieldProps = useAppointmentFields(
    appointments,
    undefined,
    modalData ? (modalData?.day as string) : undefined
  );

  if (isLoading) return <p>Loading...</p>;

  const buttonClass =
    'p-1 border border-zinc-300 rounded-xs text-zinc-600 hover:bg-zinc-200 disabled:opacity-50 cursor-pointer';

  return (
    <div className={'w-xl m-auto p-2 bg-zinc-50 shadow-md rounded'}>
      <div className='flex justify-between'>
        <div>
          <button
            onClick={() => setModalData({})}
            className={buttonClass + ' flex items-center px-2 '}
          >
            <FiPlus className='mr-1' /> New
          </button>
        </div>
        <div className='flex space-x-2 p-1'>
          <button className={buttonClass} onClick={() => onLeft()}>
            <FiChevronLeft />
          </button>
          <span className='text-sm font-medium content-center'>
            {mode === 'month'
              ? selectedWeek.toLocaleString('default', {month: 'long'}) +
                ' ' +
                selectedWeek.getFullYear()
              : null}
            {mode === 'week' ? selectedWeek.toISOString().split('T')[0] : null}
          </span>
          <button className={buttonClass} onClick={() => onRight()}>
            <FiChevronRight />
          </button>
        </div>
        <div>
          <SelectComponent
            column={{
              key: 'mode',
              label: 'Type',
              type: 'select',
              options: [
                {
                  value: 'month',
                  label: 'Month',
                },
                {
                  value: 'week',
                  label: 'Week',
                },
              ],
            }}
            filters={{
              mode: mode,
            }}
            handleFilterChange={(_column, value) => {
              setMode(value as 'month' | 'week');
            }}
          />
        </div>
      </div>
      {mode === 'month' ? (
        <div className='grid grid-cols-7 gap-1 text-center'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className='font-semibold p-1'>
              {day}
            </div>
          ))}
          {[...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].map(
            (day, index) => (
              <div
                key={index}
                className='p-1 border cursor-pointer bg-white hover:bg-blue-100 transition'
                onClick={() =>
                  handleSelect(
                    getFormattedDate(
                      1,
                      new Date(
                        selectedWeek.getFullYear(),
                        selectedWeek.getMonth(),
                        day + 1
                      )
                    ),
                    '8:00'
                  )
                }
              >
                {day !== null ? day + 1 : ''}
              </div>
            )
          )}
        </div>
      ) : null}
      {mode === 'week' ? (
        <div className='grid grid-cols-[50px_repeat(7,1fr)] gap-1 text-sm'>
          <div></div>
          {weekdays.map((day) => (
            <div key={day} className='text-center font-semibold p-1'>
              {day}
            </div>
          ))}
          {defaultTimeSlots.map((time) => (
            <>
              <div key={time} className='p-1 text-right font-medium w-[50px]'>
                {time}
              </div>
              {weekdays.map((day, index) => {
                const fullDate = getFormattedDate(
                  index,
                  new Date(selectedWeek)
                );
                const isSelected =
                  selectedSlot?.day === fullDate && selectedSlot?.time === time;
                const isBooked = appointments?.some(
                  (appt) => appt.day === fullDate && appt.time === time
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`p-1 border cursor-pointer ${
                      isBooked
                        ? 'bg-red-200'
                        : isSelected
                          ? 'bg-blue-300'
                          : 'bg-white'
                    } hover:bg-blue-100 transition`}
                    onClick={() => !isBooked && handleSelect(fullDate, time)}
                  ></div>
                );
              })}
            </>
          ))}
        </div>
      ) : null}

      {modalData && (
        <FormModal
          title='Book Appointment'
          onClose={() => setModalData(false)}
          {...appointmentFieldProps}
          data={modalData}
          onSave={saveAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
