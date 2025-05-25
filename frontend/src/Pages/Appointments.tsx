import ClientAppointments from './ClientAppointments.tsx';
import {BrowserRouter} from 'react-router-dom';

const Appointments = () => {
  return (
    <BrowserRouter>
      <ClientAppointments />
    </BrowserRouter>
  );
};

export default Appointments;
