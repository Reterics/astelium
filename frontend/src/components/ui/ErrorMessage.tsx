import React from 'react';
import { FiAlertCircle, FiX, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';
import { Typography } from './Typography';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  details?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'toast' | 'banner' | 'modal';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'An error occurred',
  message,
  details,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = '',
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  // Different styling based on variant
  const variantStyles = {
    inline: 'bg-red-50 border border-red-200 rounded-md p-3',
    toast: 'bg-white border-l-4 border-red-500 shadow-lg rounded-md p-3 max-w-md',
    banner: 'bg-red-50 border-b border-red-200 p-3 w-full',
    modal: 'bg-white border border-red-200 rounded-lg p-4 shadow-xl max-w-lg',
  };

  return (
    <div className={`${variantStyles[variant]} ${className} animate-[fadeIn_0.3s_ease-in-out]`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <FiAlertCircle
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <Typography variant="h6" className="text-red-800 font-medium">
              {title}
            </Typography>
            {onDismiss && (
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-100 inline-flex items-center justify-center h-8 w-8 transition-colors duration-200"
                onClick={onDismiss}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <FiX className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <Typography variant="p" className="mt-1 text-red-700">
            {message}
          </Typography>

          {details && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <FiHelpCircle className="mr-1 h-3 w-3" />
                {showDetails ? 'Hide technical details' : 'Show technical details'}
              </button>

              {showDetails && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800 overflow-auto max-h-32">
                  {details}
                </div>
              )}
            </div>
          )}

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <FiRefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
