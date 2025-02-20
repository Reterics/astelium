import AppointmentCalendar from '../components/AppointmentCalendar.tsx';
import CrudManager from '../components/CrudManager.tsx';

const Appointments = () => {
  return (
    <div className='flex columns-2xl'>
      <div>
        <CrudManager
          title='Appointments'
          apiEndpoint='appointments'
          fields={[]}
        />
      </div>
      <AppointmentCalendar />
    </div>
  );
};

export default Appointments;
