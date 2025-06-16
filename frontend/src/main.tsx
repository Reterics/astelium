import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n/i18n';

// Pages
import LandingPage from './Pages/Index.tsx';
import Login from './Pages/Auth/Login.tsx';
import Register from './Pages/Auth/Register.tsx';
import Appointments from './Pages/Appointments.tsx';
import AdminPanel from './Pages/Admin/Admin.tsx';

// Components
import PrivateRoute from './components/PrivateRoute.tsx';
import {baseURL} from './utils/utils.ts';

const root = document.getElementById('app');

if (root) {
  createRoot(root).render(
    <BrowserRouter basename={baseURL}>
      <App>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/appointments" element={<Appointments />} />
          </Route>

          <Route path="/admin/*" element={<AdminPanel />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </App>
    </BrowserRouter>
  );

  console.log('SPA loaded successfully');
}
