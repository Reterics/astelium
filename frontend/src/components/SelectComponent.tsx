import React, {useState, useRef, useEffect} from 'react';
import {CrudField} from './CrudManager.tsx';

export type SelectOptions = (string | SelectOption)[];

export interface SelectOption {
  label: string | React.ReactNode;
  value: string;
}

interface SelectProps {
  column: CrudField;
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const selectedOption = column.options?.find((option) =>
    typeof option === 'string'
      ? option === filters[column.key]
      : option.value === filters[column.key]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (dropdownPosition) {
      return setDropdownPosition(null);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let left = rect.left + window.scrollX;
      const rightBoundary = left + rect.width;
      const screenRight = window.innerWidth;

      if (rightBoundary > screenRight) {
        left = rect.right - rect.width;
      } else if (left < 0) {
        left = 0;
      }

      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left,
      });
    }
  };

  return (
    <div
      key={column.key}
      className='relative inline-block min-w-[6.5rem] max-w-full float-end align-top'
    >
      <button
        ref={buttonRef}
        className='w-full border border-zinc-200 px-2 py-1 text-xs font-medium bg-white focus:outline-none focus:border-blue-500 flex justify-between items-center truncate rounded-none'
        onClick={toggleDropdown}
        style={{borderRadius: 0}}
      >
        {selectedOption
          ? typeof selectedOption === 'string'
            ? selectedOption
            : selectedOption.label
          : defaultLabel}
      </button>
      {dropdownPosition && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            width: buttonRef?.current?.offsetWidth || 'unset',
            zIndex: 50,
          }}
        >
          <div
            style={{
              minWidth: buttonRef?.current?.offsetWidth || 'unset',
              borderRadius: 0,
            }}
            className='bg-white border border-zinc-200 shadow-sm rounded-none overflow-y-auto w-max max-h-56'
          >
            {column.options?.map((option) => (
              <div
                key={typeof option !== 'object' ? option : option.value}
                className='cursor-pointer px-2 py-1 text-xs whitespace-nowrap hover:bg-zinc-100'
                onClick={() => {
                  handleFilterChange(
                    column.key,
                    typeof option !== 'object' ? option : option.value
                  );
                  setDropdownPosition(null);
                }}
                style={{fontWeight: 500}}
              >
                {typeof option !== 'object' ? option : option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
