import React, { useEffect, useState } from 'react';
import EarthScene from '../../components/visualizations/EarthScene.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);

      // @ts-expect-error - Using global error boundary
      window.errorBoundary?.addError({
        title: 'Authentication Failed',
        message:
          'Unable to log in with the provided credentials. Please check your email and password and try again.',
        details: error instanceof Error ? error.stack : String(error),
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
          <h2 className='text-lg font-semibold text-center mb-3'>
            {t('login.title')}
          </h2>
          <form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
            <div>
              <input
                type='email'
                name='email'
                placeholder={t('email')}
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type='password'
                name='password'
                placeholder={t('password')}
                className='w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none'
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
              )}
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                name='remember'
                id='remember'
                checked={formData.remember}
                onChange={handleChange}
                className='accent-zinc-600'
              />
              <label htmlFor='remember' className='text-zinc-600 text-sm'>
                {t('remember_me')}
              </label>
            </div>
            <button
              type='submit'
              className='w-full p-2 rounded bg-zinc-800 text-zinc-100 hover:bg-zinc-500 transition'
              disabled={isSubmitting}
            >
              {isSubmitting ? t('signing_in') : t('sign_in')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
