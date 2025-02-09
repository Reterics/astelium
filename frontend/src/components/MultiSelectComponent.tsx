import React, {useState} from 'react';
import {FiChevronDown} from 'react-icons/fi';
import {SelectOptions} from './SelectComponent.tsx';

interface MultiSelectProps {
  column: {
    key: string;
    label: string;
    options?: SelectOptions;
  };
  filters: {[key: string]: string[]};
  handleFilterChange: (key: string, value: string[]) => void;
  defaultLabel?: string;
}

const MultiSelectComponent: React.FC<MultiSelectProps> = ({
  column,
  filters,
  handleFilterChange,
  defaultLabel = 'All',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div key={column.key} className='relative min-w-28'>
      <button
        className='w-full border border-zinc-300 p-1 rounded-xs focus:outline-none flex justify-between'
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {filters[column.key]?.length
          ? filters[column.key].join(', ')
          : defaultLabel || column.label}
        <FiChevronDown className='ml-2 self-center' />
      </button>
      {dropdownOpen && (
        <div className='absolute bg-zinc-50 border border-zinc-300 p-1 shadow-lg w-full z-20'>
          {column.options?.map((option) => (
            <label
              key={typeof option === 'string' ? option : option.value}
              className='flex items-center space-x-2'
            >
              <input
                type='checkbox'
                checked={
                  filters[column.key]?.includes(
                    typeof option === 'string' ? option : option.value
                  ) ?? false
                }
                onChange={(e) => {
                  const value =
                    typeof option === 'string' ? option : option.value;
                  const selected = filters[column.key] || [];
                  handleFilterChange(
                    column.key,
                    e.target.checked
                      ? [...selected, value]
                      : selected.filter((item: string) => item !== value)
                  );
                }}
              />
              <span>{typeof option === 'string' ? option : option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectComponent;
