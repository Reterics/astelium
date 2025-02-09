import React from 'react';

interface SelectProps {
  column: {
    key: string;
    label: string;
    options?: string[];
  };
  filters: {[key: string]: string};
  handleFilterChange: (key: string, value: string) => void;
  defaultLabel?: string;
}

const SelectComponent: React.FC<SelectProps> = ({
  column,
  filters,
  handleFilterChange,
  defaultLabel = 'All',
}) => {
  return (
    <select
      key={column.key}
      value={filters[column.key] || ''}
      onChange={(e) => handleFilterChange(column.key, e.target.value)}
      className='p-1 border border-zinc-300 rounded-xs'
    >
      {defaultLabel && <option value=''>{defaultLabel}</option>}
      {column.options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectComponent;
