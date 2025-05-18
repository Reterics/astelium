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
      setError(err.message || 'Something went wrong');
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
