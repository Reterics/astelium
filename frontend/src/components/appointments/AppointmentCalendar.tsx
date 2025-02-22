import {useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import FormModal from '../FormModal.tsx';
import SelectComponent from '../SelectComponent.tsx';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi';
import {generateTimeSlots, getFormattedDate} from '../../utils/dateUtils.ts';
import {useTranslation} from 'react-i18next';
import {useAppointmentFields} from './appointmentUtils.ts';

const defaultTimeSlots = generateTimeSlots([], ['08:00', '18:00']).map(
  (slot) => slot.time
);

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
  id?: number;
  time?: string;
  day?: string;
  length?: string;
  name?: string;
  phone?: string;
  email?: string;
  comments?: string;
}

const AppointmentCalendar = ({
  appointments,
  onSave,
}: {
  appointments: TimeSlot[];
  onSave: (appointment: TimeSlot) => void | Promise<void>;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<null | TimeSlot>(null);
  const [modalData, setModalData] = useState<false | Record<string, unknown>>(
    false
  );
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const {t} = useTranslation();

  const handleSelect = (day: string, time: string) => {
    setSelectedSlot({day, time});
    setModalData({day, time});
  };

  const saveAppointment = async (form: TimeSlot) => {
    await onSave(form);
    setModalData(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
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
    t,
    appointments,
    undefined,
    modalData ? (modalData?.day as string) : undefined
  );

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
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className='font-semibold p-1'>
              {day}
            </div>
          ))}
          {[...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].map(
            (day, index) => {
              const fullDate = new Date(
                selectedWeek.getFullYear(),
                selectedWeek.getMonth(),
                day + 1
              );

              const isPast =
                fullDate < new Date(new Date().setHours(0, 0, 0, 0));
              const isWeekend =
                fullDate.getDay() === 0 || fullDate.getDay() === 6;
              const isFullyBooked = appointments?.some(
                (appt) => appt.day === getFormattedDate(0, fullDate)
              );
              return (
                <div
                  key={index}
                  className={`p-1 border cursor-pointer transition ${
                    isPast || isWeekend || isFullyBooked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Grayed out unbookable days
                      : 'bg-white hover:bg-blue-100'
                  }`}
                  onClick={() =>
                    !(isPast || isWeekend || isFullyBooked) &&
                    handleSelect(getFormattedDate(0, fullDate), '8:00')
                  }
                >
                  {day !== null ? day + 1 : ''}
                </div>
              );
            }
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
