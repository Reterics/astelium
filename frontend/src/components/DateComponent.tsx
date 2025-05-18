import {ChangeEvent} from 'react';

export interface DateComponentProps {
  value?: string | number | readonly string[];
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DateComponent = ({
  value,
  defaultValue = new Date().toISOString().split('T')[0],
  onChange,
}: DateComponentProps) => {
  return (
    <input
      type='date'
      value={value === undefined ? defaultValue : value}
      onChange={onChange}
      className='px-2 py-1 bg-white border border-zinc-200 text-xs font-medium rounded-none focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-100'
      style={{borderRadius: 0}}
    />
  );
};

export default DateComponent;
