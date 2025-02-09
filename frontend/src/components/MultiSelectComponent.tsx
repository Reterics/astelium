import React, {useState} from 'react';
import {FiChevronDown} from 'react-icons/fi';

interface MultiSelectProps {
  column: {
    key: string;
    label: string;
    options?: string[];
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
            <label key={option} className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={filters[column.key]?.includes(option) ?? false}
                onChange={(e) => {
                  const selected = filters[column.key] || [];
                  handleFilterChange(
                    column.key,
                    e.target.checked
                      ? [...selected, option]
                      : selected.filter((item: string) => item !== option)
                  );
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectComponent;
