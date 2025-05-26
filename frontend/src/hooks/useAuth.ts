import {useState, useEffect} from 'react';
import {baseURL} from '../utils/utils.ts';
import {UserDetails} from '../components/UserProfileCard.tsx';

interface AuthResponse {
  access_token: string;
  user: UserDetails;
}

function getSavedUser() {
  let user: UserDetails | null = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || '');
    if (typeof user?.workingSchedule === 'string') {
      user.workingSchedule = JSON.parse(user.workingSchedule);
    }
  } catch (err) {
    console.error(err);
  }
  return user;
}
export const useAuth = () => {
  const [user, setUser] = useState<UserDetails | null>(getSavedUser());

  useEffect(() => {
    const storedUser = getSavedUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(baseURL + '/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await fetch(baseURL + '/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = baseURL + '/login';
  };

  return {user, login, logout};
};
