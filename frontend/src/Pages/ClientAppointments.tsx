import {useApi} from '../hooks/useApi.ts';
import ClientAppointmentCalendar from '../components/appointments/client/ClientAppointmentCalendar.tsx';
import {TimeSlot} from '../components/appointments/client/ClientAppointmentCalendar.tsx';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {
  FiCalendar,
  FiClock,
  FiBriefcase,
  FiEdit,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

const ClientAppointments = () => {
  const {t} = useTranslation();
  const {
    data: appointments,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('appointments');

  const [showBookingForm, setShowBookingForm] = useState(true);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<TimeSlot | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  if (isLoading) return <p>{t('loading')}...</p>;

  const handleReschedule = (appointment: TimeSlot) => {
    setAppointmentToReschedule(appointment);
    setIsRescheduling(true);
    setShowBookingForm(true);
  };

  const handleCancel = async (appointmentId: number) => {
    if (window.confirm(t('cancel_appointment_confirmation'))) {
      try {
        await deleteMutation.mutateAsync(appointmentId);
      } catch (error) {
        console.error('Error canceling appointment:', error);
      }
    }
  };

  const handleSaveAppointment = async (form: TimeSlot) => {
    try {
      if (isRescheduling && appointmentToReschedule?.id) {
        // Update existing appointment (reschedule)
        await updateMutation.mutateAsync({
          id: appointmentToReschedule.id,
          ...form,
        });
        setIsRescheduling(false);
        setAppointmentToReschedule(null);
      } else {
        // Use the createMutation which now handles both authenticated and guest users
        await createMutation.mutateAsync(form);
      }
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  // Filter out past appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = appointments.filter((appointment: TimeSlot) => {
    if (!appointment.day) return false;
    const appointmentDate = new Date(appointment.day);
    return appointmentDate >= today;
  });

  return (
    <div className='p-4 bg-zinc-50 flex flex-col space-y-4 mb-4 text-zinc-700'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>{t('my_appointments')}</h2>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded ${
              showBookingForm ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setShowBookingForm(true)}
          >
            {t('book_appointment')}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              !showBookingForm ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => {
              setShowBookingForm(false);
              setIsRescheduling(false);
              setAppointmentToReschedule(null);
            }}
          >
            {t('view_appointments')}
          </button>
        </div>
      </div>

      {showBookingForm ? (
        <div>
          {isRescheduling && (
            <div className='mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded'>
              <div className='flex justify-between items-center'>
                <p>
                  {t('reschedule_appointment_from')}{' '}
                  {appointmentToReschedule?.day} {t('at')}{' '}
                  {appointmentToReschedule?.time}
                </p>
                <button
                  className='text-gray-600 hover:text-gray-800'
                  onClick={() => {
                    setIsRescheduling(false);
                    setAppointmentToReschedule(null);
                  }}
                >
                  <FiX />
                </button>
              </div>
            </div>
          )}
          <ClientAppointmentCalendar
            appointments={appointments as TimeSlot[]}
            onSave={handleSaveAppointment}
          />
        </div>
      ) : (
        <div>
          {upcomingAppointments.length === 0 ? (
            <div className='text-center p-8 bg-white rounded shadow'>
              <p className='text-gray-500'>{t('no_upcoming_appointments')}</p>
              <button
                className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                onClick={() => setShowBookingForm(true)}
              >
                {t('book_new_appointment')}
              </button>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {upcomingAppointments.map((appointment: TimeSlot) => (
                <div
                  key={appointment.id}
                  className='bg-white p-4 rounded shadow border-l-4 border-blue-500'
                >
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='font-medium'>
                      {t(appointment.service_type || 'appointment')}
                    </h3>
                    <div className='flex space-x-2'>
                      <button
                        className='p-1 text-blue-500 hover:text-blue-700'
                        onClick={() => handleReschedule(appointment)}
                        title={t('reschedule')}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className='p-1 text-red-500 hover:text-red-700'
                        onClick={() => handleCancel(appointment.id as number)}
                        title={t('cancel')}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-2'>
                    <div className='flex items-center'>
                      <FiCalendar className='mr-2 text-gray-500' />
                      <span>{appointment.day}</span>
                    </div>
                    <div className='flex items-center'>
                      <FiClock className='mr-2 text-gray-500' />
                      <span>{appointment.time}</span>
                    </div>
                    <div className='flex items-center'>
                      <FiBriefcase className='mr-2 text-gray-500' />
                      <span>
                        {t(appointment.service_type || '')} (
                        {appointment.service_type === 'consultation'
                          ? '30'
                          : appointment.service_type === 'treatment'
                            ? '60'
                            : '45'}{' '}
                        min)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientAppointments;
