import React, {useState} from 'react';
import {router} from '@inertiajs/react';

const Login: React.FC = () => {
  const [data, setData] = useState({email: '', password: '', remember: false});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.post('/login', data, {
      onError: (err) => {
        setErrors(err as Record<string, string>);
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={data.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={data.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div style={{color: 'red'}}>{errors.password}</div>
          )}
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              name='remember'
              checked={data.remember}
              onChange={handleChange}
            />
            Remember Me
          </label>
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
