import { Component, ReactNode } from 'react';
import ErrorMessage from './ui/ErrorMessage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errors: {
    id: string;
    title?: string;
    message: string;
    details?: string;
    timestamp: number;
  }[];
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorState> {
  state: ErrorState = {
    hasError: false,
    error: null,
    errors: [],
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorState> {
    const now = Date.now().toString();
    return {
      error,
      hasError: true,
      errors: [{
        id: now,
        title: 'Uncaught Error',
        message: error.message,
        details: error.stack,
        timestamp: Date.now(),
      }],
    };
  }

  componentDidMount() {
    window.addEventListener('error', this.onGlobalError);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection);

    // @ts-expect-error - Expose manual error tools
    window.errorBoundary = {
      addError: this.addError,
      removeError: this.removeError,
      clearAllErrors: this.clearAllErrors,
    };
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.onGlobalError);
    window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  onGlobalError = (event: ErrorEvent) => {
    event.preventDefault();
    this.addError({
      title: 'JS Error',
      message: event.message,
      details: event.error?.stack,
    });
  };

  onUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    const message =
      event.reason?.message || 'Unhandled Promise Rejection';
    const stack = event.reason?.stack;
    this.addError({ title: 'Promise Error', message, details: stack });
  };

  addError = ({
                title,
                message,
                details,
              }: {
    title?: string;
    message: string;
    details?: string;
  }) => {
    this.setState((prev) => ({
      errors: [
        ...prev.errors,
        {
          id: Date.now().toString(),
          title,
          message,
          details,
          timestamp: Date.now(),
        },
      ],
    }));
  };

  removeError = (id: string) => {
    this.setState((prev) => ({
      errors: prev.errors.filter((e) => e.id !== id),
    }));
  };

  clearAllErrors = () => {
    this.setState({ errors: [], hasError: false, error: null });
  };

  handleRetry = () => {
    this.clearAllErrors();
  };

  render() {
    const { errors, hasError } = this.state;
    const { children } = this.props;

    return (
      <>
        {errors.length > 0 && (
          <div className='fixed top-0 left-0 right-0 z-50 flex flex-col gap-2 p-4'>
            {errors.map((error) => (
              <ErrorMessage
                key={error.id}
                title={error.title}
                message={error.message}
                details={error.details}
                variant='toast'
                onDismiss={() => this.removeError(error.id)}
              />
            ))}
          </div>
        )}
        {!hasError && children}
      </>
    );
  }
}

export default ErrorBoundary;
