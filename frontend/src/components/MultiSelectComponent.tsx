import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FiChevronDown} from 'react-icons/fi';
import {CrudField} from './CrudManager.tsx';
import {flushSync} from 'react-dom';

interface MultiSelectProps {
  column: CrudField;
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

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

  const recalculateButtonPosition = useCallback(() => {
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

      return {
        top: rect.bottom + window.scrollY,
        left,
      };
    }
    return null;
  }, [buttonRef]);
  const toggleDropdown = () => {
    if (dropdownPosition) {
      return setDropdownPosition(null);
    }
    setDropdownPosition(recalculateButtonPosition());
  };

  return (
    <div
      key={column.key}
      className='relative inline-block min-w-16 max-w-full float-end'
    >
      <button
        ref={buttonRef}
        className='max-w-full border border-zinc-300 p-1 rounded-xs focus:outline-none flex justify-end truncate'
        onClick={toggleDropdown}
      >
        <div className='flex-1 text-nowrap'>
          {filters[column.key]?.length
            ? filters[column.key]
                .map((value) => {
                  const option = column.options?.find(
                    (option) =>
                      option === value ||
                      (typeof option === 'object' && option.value === value)
                  );

                  if (typeof option === 'object') {
                    return option.label;
                  }
                  return option || value;
                })
                .join(', ')
            : defaultLabel || column.label}
        </div>
        <div className='self-center w-4'>
          <FiChevronDown />
        </div>
      </button>
      {dropdownPosition && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPosition?.top,
            left: dropdownPosition?.left,
            width: buttonRef?.current?.offsetWidth || 'unset',
            zIndex: 50,
          }}
        >
          <div
            style={{
              minWidth: buttonRef?.current?.offsetWidth || 'unset',
            }}
            className='bg-white border border-zinc-300 shadow-lg rounded-xs overflow-hidden overflow-y-auto w-max justify-self-end'
          >
            {column.options?.map((option) => (
              <label
                key={typeof option !== 'object' ? option : option.value}
                className='flex items-center space-x-2 cursor-pointer px-2 py-1 hover:bg-zinc-200 text-sm whitespace-nowrap'
              >
                <input
                  type='checkbox'
                  checked={
                    filters[column.key]?.includes(
                      typeof option !== 'object' ? option : option.value
                    ) ?? false
                  }
                  onChange={(e) => {
                    const value =
                      typeof option !== 'object' ? option : option.value;
                    const selected = filters[column.key] || [];

                    flushSync(() => {
                      handleFilterChange(
                        column.key,
                        e.target.checked
                          ? [...selected, value]
                          : selected.filter((item: string) => item !== value)
                      );
                    });
                    setDropdownPosition(recalculateButtonPosition());
                  }}
                />
                <span>
                  {typeof option !== 'object' ? option : option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectComponent;
