import React from 'react';

export type SelectOptions = (string | SelectOption)[];

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  column: {
    key: string;
    label: string;
    options?: SelectOptions;
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
      {column.options?.map((option) =>
        typeof option === 'string' ? (
          <option key={option} value={option}>
            {option}
          </option>
        ) : (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )
      )}
    </select>
  );
};

export default SelectComponent;
