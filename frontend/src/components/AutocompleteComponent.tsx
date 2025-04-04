import React, {useState, useRef, useEffect} from 'react';
import {CrudField} from './CrudManager';
import {SelectOption, SelectOptions} from './SelectComponent.tsx';

interface AutocompleteProps {
  column: CrudField;
  filters: {[key: string]: string};
  handleFilterChange: (key: string, value: string) => void;
  defaultLabel?: string;
  filter?: (input: string) => Promise<(string | SelectOption)[]>;
}

const defaultFilter = (options: SelectOptions) => async (input: string) => {
  if (!input.trim()) return options;
  return options.filter((option) => {
    const label = typeof option === 'string' ? option : option.label;
    return label?.toString().toLowerCase().includes(input.toLowerCase());
  });
};

const AutocompleteComponent: React.FC<AutocompleteProps> = ({
  column,
  filters,
  handleFilterChange,
  defaultLabel = 'All',
  filter = defaultFilter(column.options || []),
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SelectOptions>(column.options || []);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const selectedOption = options?.find((option) =>
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
      setDropdownPosition(null);
      return;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(async () => {
      const filtered = await filter(value as string);
      setOptions(filtered);
    }, 400);

    setDebounceTimeout(timeout);
  };

  return (
    <div
      key={column.key}
      className='relative inline-block min-w-28 max-w-full float-end'
    >
      <button
        ref={buttonRef}
        className='w-full border border-zinc-300 px-2 py-1 rounded-xs focus:outline-none flex justify-between items-center truncate bg-white'
        onClick={toggleDropdown}
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
          <div className='bg-white border border-zinc-300 shadow-lg rounded-xs overflow-hidden overflow-y-auto w-max'>
            <input
              type='text'
              className='w-full p-2 border-b border-zinc-300 outline-none'
              placeholder='Type to search...'
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
            {options?.map((option) => (
              <div
                key={typeof option !== 'object' ? option : option.value}
                className='cursor-pointer px-2 py-1 hover:bg-zinc-200 text-sm whitespace-nowrap'
                onClick={() => {
                  handleFilterChange(
                    column.key,
                    typeof option !== 'object' ? option : option.value
                  );
                  setDropdownPosition(null);
                  setInputValue('');
                }}
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

export default AutocompleteComponent;
