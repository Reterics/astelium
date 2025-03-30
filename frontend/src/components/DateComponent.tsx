import {ChangeEvent} from 'react';

export interface DateComponentProps {
  value?: string | number | readonly string[],
  defaultValue?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const DateComponent = (
  {
    value,
    defaultValue = new Date().toISOString().split("T")[0],
    onChange,
  }: DateComponentProps
) => {

  return (
    <input
      type="date"
      value={value === undefined ? defaultValue : value}
      onChange={onChange}
      className='p-1 bg-white border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
    />
  )
};


export default DateComponent
