import React, { useState, useRef, useEffect } from 'react';
import { CrudField } from './CrudManager.tsx';

export type SelectOptions = (string | SelectOption)[];

export interface SelectOption {
  label: string | React.ReactNode;
  value: string;
}

interface SelectProps {
  column: CrudField;
  filters: { [key: string]: string };
  handleFilterChange: (key: string, value: string) => void;
  defaultLabel?: string;
}

const SelectComponent: React.FC<SelectProps> = ({
  column,
  filters,
  handleFilterChange,
  defaultLabel = 'All',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{top: number; left: number;}|null>(null);

  const selectedOption = column.options?.find(
    (option) =>
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

  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [dropdownOpen]);

  return (
    <div className='relative inline-block min-w-28'>
      <button
        ref={buttonRef}
        className='w-full border border-zinc-300 px-2 py-1 rounded-xs focus:outline-none flex justify-between items-center truncate bg-white'
        onClick={() => setDropdownOpen((prev) => !prev)}
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
            top: dropdownPosition?.top,
            left: dropdownPosition?.left,
            minWidth: buttonRef?.current?.offsetWidth || "unset",
            zIndex: 50,
          }}
          className='bg-white border border-zinc-300 shadow-lg rounded-xs overflow-hidden overflow-y-auto'
        >
          {column.options?.map((option) => (
            <div
              key={typeof option !== 'object' ? option : option.value}
              className='cursor-pointer px-2 py-1 hover:bg-zinc-200 text-sm whitespace-nowrap'
              onClick={() => {
                handleFilterChange(
                  column.key,
                  typeof option !== 'object' ? option : option.value
                );
                setDropdownOpen(false);
              }}
            >
              {typeof option !== 'object' ? option : option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
