import React, {useState, useEffect} from 'react';
import ErrorMessage from './ui/ErrorMessage';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({children}) => {
  const [errors, setErrors] = useState<
    Array<{
      id: string;
      title?: string;
      message: string;
      details?: string;
      timestamp: number;
    }>
  >([]);

  // Listen for unhandled errors
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      addError({
        title: 'Unexpected Error',
        message: event.message || 'An unexpected error occurred',
        details: event.error?.stack,
      });
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      addError({
        title: 'Promise Error',
        message:
          event.reason?.message || 'An unexpected promise error occurred',
        details: event.reason?.stack,
      });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  // Add a new error to the errors array
  const addError = ({
    title,
    message,
    details,
  }: {
    title?: string;
    message: string;
    details?: string;
  }) => {
    setErrors((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        message,
        details,
        timestamp: Date.now(),
      },
    ]);
  };

  // Remove an error from the errors array
  const removeError = (id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  };

  // Expose the error handling functions to the window object
  useEffect(() => {
    // @ts-expect-error - Adding custom property to window object
    window.errorBoundary = {
      addError,
      removeError,
      clearAllErrors: () => setErrors([]),
    };
  }, []);

  return (
    <>
      {/* Error messages container */}
      {errors.length > 0 && (
        <div className='fixed top-0 left-0 right-0 z-50 flex flex-col gap-2 p-4'>
          {errors.map((error) => (
            <ErrorMessage
              key={error.id}
              title={error.title}
              message={error.message}
              details={error.details}
              variant='toast'
              onDismiss={() => removeError(error.id)}
            />
          ))}
        </div>
      )}
      {children}
    </>
  );
};

export default ErrorBoundary;
