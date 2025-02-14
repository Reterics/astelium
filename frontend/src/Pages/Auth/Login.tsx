import React, {useEffect, useState} from 'react';
import EarthScene from "../../components/visualizations/EarthScene.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

const Login: React.FC = () => {
  const { user, login } = useAuth();

  const [data, setData] = useState({email: '', password: '', remember: false});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  useEffect(() => {
    if (user) {
      window.location.href = "/admin/dashboard";
    }
  }, [user]);

  return (
    <div className="bg-zinc-100 text-zinc-700">
      <div className='absolute w-full h-dvh'>
        <EarthScene />
      </div>
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-zinc-100/95 p-4 rounded-lg shadow-md w-72 border border-zinc-400/75">
          <h2 className="text-lg font-semibold text-center mb-3">Login</h2>
          <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none"
            />
            <input
              type='password'
              name='password'
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 rounded !bg-zinc-300 !placeholder-zinc-400 focus:ring-2 focus:ring-zinc-500 outline-none"
            />
            <div className="flex items-center space-x-2">
              <input type='checkbox'
                     name='remember'
                     checked={data.remember}
                     onChange={handleChange}
                     id="remember"
                     className="accent-zinc-600" />
              <label htmlFor="remember" className="text-zinc-600 text-sm">Remember me</label>
            </div>
            <button
              type="submit"
              className="w-full p-2 rounded bg-zinc-800 text-zinc-100 hover:bg-zinc-500 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
