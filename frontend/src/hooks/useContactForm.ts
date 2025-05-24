import {useState} from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const useContactForm = () => {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof ContactFormData, value: string) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  const submit = async () => {
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Submission failed');
      }

      setSuccess('Your message has been sent!');
      setForm({name: '', email: '', phone: '', message: ''});
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);

      // Also add to global error handling for consistent UI
      // @ts-expect-error - Using global error boundary
      window.errorBoundary?.addError({
        title: 'Contact Form Error',
        message: 'There was a problem submitting your message. Please try again.',
        details: err instanceof Error ? err.stack : String(err)
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    success,
    error,
    handleChange,
    submit,
  };
};
