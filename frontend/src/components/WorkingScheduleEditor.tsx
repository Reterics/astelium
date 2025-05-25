import React, {useState, useEffect} from 'react';

interface WorkingSchedule {
  days: string[];
  hours: string;
}

interface WorkingScheduleEditorProps {
  value: WorkingSchedule | string;
  onChange: (value: WorkingSchedule) => void;
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const WorkingScheduleEditor: React.FC<WorkingScheduleEditorProps> = ({
  value,
  onChange,
}) => {
  // Initialize state with parsed value or default
  const [schedule, setSchedule] = useState<WorkingSchedule>(() => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as WorkingSchedule;
      } catch {
        return {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: '9:00 AM - 5:00 PM',
        };
      }
    }
    return (
      value || {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: '9:00 AM - 5:00 PM',
      }
    );
  });

  // Update parent component when schedule changes
  useEffect(() => {
    onChange(schedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  // Handle day selection/deselection
  const handleDayToggle = (day: string) => {
    setSchedule((prev) => {
      const newDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];

      return {
        ...prev,
        days: newDays,
      };
    });
  };

  // Handle hours change
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchedule((prev) => ({
      ...prev,
      hours: e.target.value,
    }));
  };

  return (
    <div className='working-schedule-editor'>
      <div className='mb-3'>
        <label className='block text-sm font-medium text-zinc-700 mb-1'>
          Working Days
        </label>
        <div className='flex flex-wrap gap-2'>
          {daysOfWeek.map((day) => (
            <button
              key={day}
              type='button'
              onClick={() => handleDayToggle(day)}
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                schedule.days.includes(day)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-zinc-700 mb-1'>
          Working Hours
        </label>
        <input
          type='text'
          value={schedule.hours}
          onChange={handleHoursChange}
          placeholder='e.g. 9:00 AM - 5:00 PM'
          className='px-2 py-1 bg-white border border-zinc-200 text-xs font-medium rounded-none focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-100 w-full'
        />
        <div className='text-gray-500 text-xs mt-1'>
          Enter hours in format: "9:00 AM - 5:00 PM"
        </div>
      </div>
    </div>
  );
};

export default WorkingScheduleEditor;
