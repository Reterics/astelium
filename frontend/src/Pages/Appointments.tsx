import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useApi } from "../hooks/useApi.ts";
import FormModal from "../components/FormModal.tsx";

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface TimeSlot {
  time?: string;
  day?: string;
  length?: string;
  name?: string;
  phone?: string;
  email?: string;
  comments?: string;
}

const Appointments = () => {
  const { data: appointments, isLoading, createMutation } = useApi('appointments');
  const [selectedSlot, setSelectedSlot] = useState<null | TimeSlot>(null);
  const [modalData, setModalData] = useState<false | Record<string, unknown>>(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const getFormattedDate = (offset: number) => {
    const date = new Date(selectedWeek);
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0];
  };

  const handleSelect = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setModalData({ day, time });
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

  const previousMonth = () => {
    setSelectedWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setSelectedWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-2 bg-zinc-50 shadow-md rounded">
      <div className="p-2 bg-zinc-50 shadow-md rounded text-sm">
        <div className="flex justify-between items-center mb-2">
          <button onClick={previousMonth}>&lt; Previous Month</button>
          <span>
          {selectedWeek.toLocaleString('default', { month: 'long' })} {selectedWeek.getFullYear()}
        </span>
          <button onClick={nextMonth}>Next Month &gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold p-1">{day}</div>
          ))}
          {[...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].map((day, index) => (
            <div key={index} className="p-1 border cursor-pointer bg-white hover:bg-blue-100 transition">
              {day !== null ? day + 1 : ""}
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-lg font-bold mb-2">Appointments</h2>
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setSelectedWeek(prev => new Date(prev.setDate(prev.getDate() - 7)))}>&lt; Previous Week</button>
        <span>{selectedWeek.toISOString().split('T')[0]}</span>
        <button onClick={() => setSelectedWeek(prev => new Date(prev.setDate(prev.getDate() + 7)))}>Next Week &gt;</button>
      </div>
      <div className="grid grid-cols-[50px_repeat(7,1fr)] gap-1 text-sm">
        <div></div>
        {weekdays.map((day) => (
          <div key={day} className="text-center font-semibold p-1">{day}</div>
        ))}
        {timeSlots.map((time) => (
          <>
            <div key={time} className="p-1 text-right font-medium w-[50px]">{time}</div>
            {weekdays.map((day, index) => {
              const fullDate = getFormattedDate(index);
              const isSelected = selectedSlot?.day === fullDate && selectedSlot?.time === time;
              const isBooked = appointments?.some(appt => appt.day === fullDate && appt.time === time);
              return (
                <div
                  key={`${day}-${time}`}
                  className={`p-1 border cursor-pointer ${
                    isBooked ? 'bg-red-200' : isSelected ? 'bg-blue-300' : 'bg-white'
                  } hover:bg-blue-100 transition`}
                  onClick={() => !isBooked && handleSelect(fullDate, time)}
                ></div>
              );
            })}
          </>
        ))}
      </div>
      <button
        onClick={() => setModalData({})}
        className="mt-2 flex items-center bg-zinc-800 text-white px-2 py-1 rounded hover:bg-zinc-700 text-sm"
      >
        <FiPlus className="mr-1" /> Add Appointment
      </button>
      {modalData && (
        <FormModal
          title="Book Appointment"
          onClose={() => setModalData(false)}
          fields={[
            { key: 'day', label: 'Date', type: 'text', editable: false },
            { key: 'time', label: 'Time', type: 'text', editable: false },
            { key: 'length', label: 'Length (minutes)', type: 'select', options: ['30', '60', '90'].map(e => ({ value: e, label: e })) },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'comments', label: 'Comments', type: 'text' },
          ]}
          data={modalData}
          onSave={saveAppointment}
        />
      )}
    </div>
  );
};

export default Appointments;
