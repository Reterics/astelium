import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX, FiEye, FiEyeOff } from 'react-icons/fi';

type InputStatus = 'default' | 'success' | 'error' | 'warning';
type InputSize = 'sm' | 'md' | 'lg';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  warning?: string;
  success?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  status?: InputStatus;
  size?: InputSize;
  showPasswordToggle?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  hideLabel?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className = '',
    error,
    warning,
    success,
    label,
    helperText,
    id,
    leftIcon,
    rightIcon,
    status = 'default',
    size = 'md',
    showPasswordToggle = false,
    required = false,
    fullWidth = true,
    hideLabel = false,
    labelClassName = '',
    inputClassName = '',
    containerClassName = '',
    type = 'text',
    onChange,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState(props.value || '');

    // Determine status based on props
    const computedStatus = error ? 'error' : warning ? 'warning' : success ? 'success' : status;

    // Handle password visibility toggle
    const actualType = type === 'password' && showPassword ? 'text' : type;

    // Handle input value changes
    useEffect(() => {
      if (props.value !== undefined) {
        setInputValue(props.value);
      }
    }, [props.value]);

    // Size classes
    const sizeClasses = {
      sm: 'h-8 text-xs px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4'
    };

    // Status classes
    const statusClasses = {
      default: 'border-zinc-300 focus:border-blue-500 focus:ring-blue-500',
      success: 'border-green-500 focus:border-green-600 focus:ring-green-500',
      error: 'border-red-500 focus:border-red-600 focus:ring-red-500',
      warning: 'border-amber-500 focus:border-amber-600 focus:ring-amber-500'
    };

    // Status icons
    const statusIcons = {
      success: <FiCheckCircle className="w-4 h-4 text-green-500" />,
      error: <FiAlertCircle className="w-4 h-4 text-red-500" />,
      warning: <FiInfo className="w-4 h-4 text-amber-500" />
    };

    // Status messages
    const statusMessage = error || warning || success;

    // Handle focus events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) onChange(e);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
        {label && !hideLabel && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-zinc-700 mb-1.5 ${labelClassName}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={actualType}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              w-full rounded-md border bg-white text-zinc-900
              transition-all duration-200
              placeholder:text-zinc-400
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50
              ${sizeClasses[size]}
              ${statusClasses[computedStatus]}
              ${leftIcon ? 'pl-10' : ''}
              ${(rightIcon || showPasswordToggle || computedStatus !== 'default') ? 'pr-10' : ''}
              ${inputClassName}
              ${className}
            `}
            aria-invalid={computedStatus === 'error' ? 'true' : 'false'}
            aria-describedby={
              statusMessage
                ? `${inputId}-status`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Right side icons (status, password toggle, or custom) */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {computedStatus !== 'default' && statusIcons[computedStatus]}

            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-zinc-500 hover:text-zinc-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            )}

            {rightIcon && !showPasswordToggle && computedStatus === 'default' && rightIcon}
          </div>

          {/* Clear button - only show when input has value and is focused */}
          {isFocused && inputValue && props.readOnly !== true && (
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(inputId) as HTMLInputElement;
                if (input) {
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  )?.set;
                  if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(input, '');
                    const event = new Event('input', { bubbles: true });
                    input.dispatchEvent(event);
                    setInputValue('');
                    if (onChange) {
                      onChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
                    }
                  }
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
              tabIndex={-1}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status or helper message */}
        {statusMessage && (
          <div
            id={`${inputId}-status`}
            className={`mt-1.5 text-sm flex items-center gap-1.5 ${
              computedStatus === 'error'
                ? 'text-red-600'
                : computedStatus === 'warning'
                  ? 'text-amber-600'
                  : 'text-green-600'
            }`}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {statusIcons[computedStatus]}
            <span>{statusMessage}</span>
          </div>
        )}

        {!statusMessage && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-zinc-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
