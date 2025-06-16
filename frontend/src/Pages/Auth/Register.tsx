import React, { useEffect, useState } from 'react';
import EarthScene from '../../components/visualizations/EarthScene.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { useNavigate, Link } from 'react-router-dom';
import { baseURL } from '../../utils/utils.ts';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  company: string;
  subscription_plan: string;
};

const Register: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    company: '',
    subscription_plan: 'free',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterFormData | 'root', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const errors: typeof formErrors = {};

    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.company) {
      errors.company = 'Company name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseURL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.user) {
          await login(formData.email, formData.password);
        }
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          const newErrors: typeof formErrors = {};
          Object.entries(errorData.errors).forEach(([key, messages]) => {
            newErrors[key as keyof RegisterFormData] = (messages as string[])[0];
          });
          setFormErrors(newErrors);
        } else {
          setFormErrors({ root: 'Registration failed. Please check your details.' });
        }
      }
    } catch (err) {
      setFormErrors({ root: 'An error occurred during registration. Please try again.' });

      // @ts-expect-error - Using global error boundary
      window.errorBoundary?.addError({
        title: 'Registration Failed',
        message: 'Unable to register. Please try again later.',
        details: err instanceof Error ? err.stack : String(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'client') {
      navigate('/appointments');
    } else if (user?.role) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className='bg-zinc-100 text-zinc-700'>
      <div className='absolute w-full h-dvh'>
        <EarthScene />
      </div>
      <div className='relative flex items-center justify-center min-h-screen'>
        <div className='bg-zinc-100/95 p-4 rounded-lg shadow-md w-72 border border-zinc-400/75'>
          <h2 className='text-lg font-semibold text-center mb-3'>Create Account</h2>

          {formErrors.root && (
            <p className='text-red-500 text-sm mb-2 text-center'>{formErrors.root}</p>
          )}

          <form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
            <div>
              <input
                type='text'
                name='name'
                placeholder='Your Name'
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.name}</p>
              )}
            </div>

            <div>
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.email}</p>
              )}
            </div>

            <div>
              <input
                type='password'
                name='password'
                placeholder='Password'
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.password}</p>
              )}
            </div>

            <div>
              <input
                type='text'
                name='company'
                placeholder='Company Name'
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.company}
                onChange={handleChange}
              />
              {formErrors.company && (
                <p className='text-red-500 text-xs mt-1'>{formErrors.company}</p>
              )}
            </div>

            <div>
              <select
                name='subscription_plan'
                className='w-full p-2 rounded !bg-zinc-300 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.subscription_plan}
                onChange={handleChange}
              >
                <option value='free'>Free</option>
                <option value='premium'>Premium</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full p-2 rounded bg-zinc-800 text-zinc-100 hover:bg-zinc-500 transition'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <p className='text-xs text-zinc-500 mt-3 text-center'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-zinc-700 hover:underline'
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
