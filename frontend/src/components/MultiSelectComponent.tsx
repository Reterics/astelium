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
      className='relative inline-block min-w-[4rem] max-w-full float-end align-top'
    >
      <button
        ref={buttonRef}
        className='max-w-full bg-white border border-zinc-200 px-2 py-1 text-xs font-medium focus:outline-none focus:border-blue-500 flex justify-end items-center truncate rounded-none'
        onClick={toggleDropdown}
        style={{borderRadius: 0}}
      >
        <div className='flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-left'>
          {filters[column.key]?.length
            ? filters[column.key]
                .map((value) => {
                  const option = column.options?.find(
                    (option) =>
                      option === value ||
                      (typeof option === 'object' && option.value === value)
                  );
                  if (typeof option === 'object') return option.label;
                  return option || value;
                })
                .join(', ')
            : defaultLabel || column.label}
        </div>
        <div className='ml-2 w-4 flex items-center'>
          <FiChevronDown className='w-4 h-4 text-zinc-500' />
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
              borderRadius: 0,
            }}
            className='bg-white border border-zinc-200 shadow-sm rounded-none overflow-y-auto w-max max-h-56'
          >
            {column.options?.map((option) => (
              <label
                key={typeof option !== 'object' ? option : option.value}
                className='flex items-center gap-2 cursor-pointer px-2 py-1 text-xs hover:bg-zinc-100 whitespace-nowrap font-medium'
                style={{fontWeight: 500}}
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
                          : selected.filter((item) => item !== value)
                      );
                    });
                    setDropdownPosition(recalculateButtonPosition());
                  }}
                  className='accent-blue-600 w-3.5 h-3.5'
                  style={{borderRadius: 2}}
                />
                <span className='truncate'>
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
