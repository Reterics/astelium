import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

type TextareaStatus = 'default' | 'success' | 'error' | 'warning';
type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  warning?: string;
  success?: string;
  label?: string;
  helperText?: string;
  status?: TextareaStatus;
  size?: TextareaSize;
  required?: boolean;
  fullWidth?: boolean;
  hideLabel?: boolean;
  labelClassName?: string;
  textareaClassName?: string;
  containerClassName?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className = '',
    error,
    warning,
    success,
    label,
    helperText,
    id,
    status = 'default',
    size = 'md',
    required = false,
    fullWidth = true,
    hideLabel = false,
    labelClassName = '',
    textareaClassName = '',
    containerClassName = '',
    rows = 4,
    maxLength,
    showCharacterCount = false,
    autoResize = false,
    onChange,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);
    const [textValue, setTextValue] = useState(props.value || '');

    // Determine status based on props
    const computedStatus = error ? 'error' : warning ? 'warning' : success ? 'success' : status;

    // Handle textarea value changes
    useEffect(() => {
      if (props.value !== undefined) {
        setTextValue(props.value);
      }
    }, [props.value]);

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && typeof textValue === 'string') {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (textarea) {
          // Reset height to auto to get the correct scrollHeight
          textarea.style.height = 'auto';
          // Set the height to scrollHeight to fit the content
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }
    }, [textValue, autoResize, textareaId]);

    // Size classes
    const sizeClasses = {
      sm: 'text-xs px-2 py-1.5',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-2.5'
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

    // Character count
    const characterCount = typeof textValue === 'string' ? textValue.length : 0;

    // Handle focus events
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Handle textarea change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextValue(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <div className={`${fullWidth ? 'w-full' : 'w-auto'} ${containerClassName}`}>
        {label && !hideLabel && (
          <label
            htmlFor={textareaId}
            className={`block text-sm font-medium text-zinc-700 mb-1.5 ${labelClassName}`}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className={`relative transition-all duration-200 ${isFocused ? 'scale-[1.01]' : ''}`}>
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            value={textValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={autoResize ? { overflow: 'hidden' } : undefined}
            className={`
              w-full rounded-md border bg-white text-zinc-900
              transition-all duration-200
              placeholder:text-zinc-400
              focus:outline-none focus:ring-2 focus:ring-offset-1
              disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50
              resize-y
              ${sizeClasses[size]}
              ${statusClasses[computedStatus]}
              ${textareaClassName}
              ${className}
            `}
            aria-invalid={computedStatus === 'error' ? 'true' : 'false'}
            aria-describedby={
              statusMessage
                ? `${textareaId}-status`
                : helperText
                  ? `${textareaId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>

        {/* Character count and status message container */}
        <div className="mt-1.5 flex justify-between items-start">
          <div className="flex-1">
            {/* Status or helper message */}
            {statusMessage && (
              <div
                id={`${textareaId}-status`}
                className={`text-sm flex items-center gap-1.5 ${
                  computedStatus === 'error'
                    ? 'text-red-600'
                    : computedStatus === 'warning'
                      ? 'text-amber-600'
                      : 'text-green-600'
                }`}
              >
                {statusIcons[computedStatus]}
                <span>{statusMessage}</span>
              </div>
            )}

            {!statusMessage && helperText && (
              <p id={`${textareaId}-helper`} className="text-xs text-zinc-500">
                {helperText}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCharacterCount && (
            <div className={`text-xs ${maxLength && characterCount >= maxLength * 0.9 ? 'text-amber-600' : 'text-zinc-500'}`}>
              {characterCount}{maxLength ? `/${maxLength}` : ''}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps, TextareaStatus, TextareaSize };
