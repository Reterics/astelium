import {useState, useEffect} from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiBriefcase,
} from 'react-icons/fi';
import SelectComponent from '../../SelectComponent.tsx';
import {generateTimeSlots, getFormattedDate} from '../../../utils/dateUtils.ts';
import {useTranslation} from 'react-i18next';
import {baseURL, getFetchOptions} from '../../../utils/utils.ts';
import {useSearchParams} from 'react-router-dom';
import UserProfileCard, {UserDetails} from '../../UserProfileCard';

const defaultTimeSlots = generateTimeSlots([], ['08:00', '18:00']).map(
  (slot) => slot.time
);

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface TimeSlot {
  id?: number;
  time?: string;
  day?: string;
  length?: string;
  name?: string;
  phone?: string;
  email?: string;
  comments?: string;
  service_type?: string;
  user_id?: number;
}

/**
 * Client Appointment Calendar Component
 *
 * This component allows clients to book appointments by selecting a date, time, and providing their information.
 *
 * URL Query Parameters:
 * - user_id: Optional. If provided, this user ID will be used for the appointment instead of looking up the user in localStorage.
 *   Example: /appointments?user_id=123
 */
const ClientAppointmentCalendar = ({
  appointments,
  onSave,
}: {
  appointments: TimeSlot[];
  onSave: (appointment: TimeSlot) => void | Promise<void>;
}) => {
  // Booking flow steps: 1 = select date, 2 = select time, 3 = enter info, 4 = confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<null | TimeSlot>(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const [serviceType, setServiceType] = useState<string>('consultation');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<null | TimeSlot>(
    null
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoadingUserDetails, setIsLoadingUserDetails] =
    useState<boolean>(false);
  const {t} = useTranslation();
  const [searchParams] = useSearchParams();

  // Use effect to fetch user details when user_id changes
  useEffect(() => {
    const urlUserId = searchParams.get('user_id');
    if (urlUserId) {
      void fetchUserDetails(parseInt(urlUserId, 10));
    }
  }, [searchParams]);

  // Fetch user details by ID
  const fetchUserDetails = async (userId: number) => {
    setIsLoadingUserDetails(true);
    try {
      const response = await fetch(`${baseURL}/api/users/${userId}`, {
        ...getFetchOptions(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();

      // Create a default working schedule if not provided
      if (!userData.workingSchedule) {
        userData.workingSchedule = {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          hours: '9:00 AM - 5:00 PM',
        };
      } else if (typeof userData.workingSchedule === 'string') {
        userData.workingSchedule = JSON.parse(userData.workingSchedule);
      }

      // Create a default bio if not provided
      if (!userData.bio) {
        userData.bio = '';
      }

      setUserDetails(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  // Fetch available time slots based on service type and day
  const fetchAvailableTimeSlots = async (day: string, service: string) => {
    setIsLoadingTimeSlots(true);
    try {
      const response = await fetch(`${baseURL}/api/available-time-slots`, {
        ...getFetchOptions(),
        method: 'POST',
        body: JSON.stringify({
          service_type: service,
          day: day,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available time slots');
      }

      const data = await response.json();
      setAvailableTimeSlots(data.available_time_slots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const handleSelect = (day: string, time?: string) => {
    if (time) {
      // If time is provided, we're selecting a specific time slot
      setSelectedSlot({day, time, service_type: serviceType});
      setCurrentStep(3); // Move to client information step
    } else {
      // If only day is provided, we're selecting a date
      setSelectedSlot({day, service_type: serviceType});
      void fetchAvailableTimeSlots(day, serviceType);
      setCurrentStep(2); // Move to time selection step
    }
  };

  const saveAppointment = async () => {
    // Add service type to the form data
    const appointmentData: TimeSlot = {
      user_id: userDetails?.id,
      ...selectedSlot,
      service_type: serviceType,
      length:
        serviceType === 'consultation'
          ? '30'
          : serviceType === 'treatment'
            ? '60'
            : '45',
    };

    try {
      await onSave(appointmentData);
      setConfirmationData(appointmentData);
      setCurrentStep(4); // Move to confirmation step
    } catch (error) {
      console.error('Error saving appointment:', error);
      // Handle error (could show an error message)
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetBooking = () => {
    setSelectedSlot(null);
    setConfirmationData(null);
    setCurrentStep(1);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const daysInMonth = getDaysInMonth(selectedWeek);
  const firstDay = getFirstDayOfMonth(selectedWeek);

  const onLeft = () => {
    if (mode === 'month') {
      setSelectedWeek((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
    } else if (mode === 'week') {
      setSelectedWeek((prev) => new Date(prev.setDate(prev.getDate() - 7)));
    }
  };

  const onRight = () => {
    if (mode === 'month') {
      setSelectedWeek((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
    } else if (mode === 'week') {
      setSelectedWeek((prev) => new Date(prev.setDate(prev.getDate() + 7)));
    }
  };

  const buttonClass =
    'p-1 border border-zinc-300 rounded-xs text-zinc-600 hover:bg-zinc-200 disabled:opacity-50 cursor-pointer';

  // Render different steps based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1: // Calendar view
        return (
          <>
            <div className='flex flex-col md:flex-row justify-between mb-4'>
              <div className='flex space-x-2 p-1 mb-2 md:mb-0'>
                <button className={buttonClass} onClick={() => onLeft()}>
                  <FiChevronLeft />
                </button>
                <span className='text-sm font-medium content-center'>
                  {mode === 'month'
                    ? selectedWeek.toLocaleString('default', {month: 'long'}) +
                      ' ' +
                      selectedWeek.getFullYear()
                    : null}
                  {mode === 'week'
                    ? selectedWeek.toISOString().split('T')[0]
                    : null}
                </span>
                <button className={buttonClass} onClick={() => onRight()}>
                  <FiChevronRight />
                </button>
              </div>
              <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
                <div>
                  <SelectComponent
                    column={{
                      key: 'serviceType',
                      label: t('service_type'),
                      type: 'select',
                      options: [
                        {
                          value: 'consultation',
                          label: t('consultation'),
                        },
                        {
                          value: 'treatment',
                          label: t('treatment'),
                        },
                        {
                          value: 'followup',
                          label: t('followup'),
                        },
                      ],
                    }}
                    filters={{
                      serviceType: serviceType,
                    }}
                    handleFilterChange={(_column, value) => {
                      setServiceType(value as string);
                    }}
                  />
                </div>
                <div>
                  <SelectComponent
                    column={{
                      key: 'mode',
                      label: 'Type',
                      type: 'select',
                      options: [
                        {
                          value: 'month',
                          label: 'Month',
                        },
                        {
                          value: 'week',
                          label: 'Week',
                        },
                      ],
                    }}
                    filters={{
                      mode: mode,
                    }}
                    handleFilterChange={(_column, value) => {
                      setMode(value as 'month' | 'week');
                    }}
                  />
                </div>
              </div>
            </div>

            {mode === 'month' ? (
              <div className='grid grid-cols-7 gap-1 text-center'>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                  (day) => (
                    <div key={day} className='font-semibold p-1'>
                      {day}
                    </div>
                  )
                )}
                {[
                  ...Array(firstDay).fill(null),
                  ...Array(daysInMonth).keys(),
                ].map((day, index) => {
                  const fullDate = new Date(
                    selectedWeek.getFullYear(),
                    selectedWeek.getMonth(),
                    day + 1
                  );

                  const isPast =
                    fullDate < new Date(new Date().setHours(0, 0, 0, 0));
                  const isWeekend =
                    fullDate.getDay() === 0 || fullDate.getDay() === 6;
                  // Check if the day has any appointments
                  // This is now user-specific due to backend filtering
                  const isFullyBooked = appointments?.some(
                    (appt) => appt.day === getFormattedDate(0, fullDate)
                  );
                  return (
                    <div
                      key={index}
                      className={`p-1 border cursor-pointer transition ${
                        isPast || isWeekend || isFullyBooked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Grayed out unbookable days
                          : 'bg-white hover:bg-blue-100'
                      }`}
                      onClick={() =>
                        !(isPast || isWeekend || isFullyBooked) &&
                        handleSelect(getFormattedDate(0, fullDate))
                      }
                    >
                      {day !== null ? day + 1 : ''}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {mode === 'week' ? (
              <div className='grid grid-cols-[50px_repeat(7,1fr)] gap-1 text-sm overflow-x-auto'>
                <div></div>
                {weekdays.map((day) => (
                  <div key={day} className='text-center font-semibold p-1'>
                    {day}
                  </div>
                ))}
                {defaultTimeSlots.map((time) => (
                  <>
                    <div
                      key={time}
                      className='p-1 text-right font-medium w-[50px]'
                    >
                      {time}
                    </div>
                    {weekdays.map((day, index) => {
                      const fullDate = getFormattedDate(
                        index,
                        new Date(selectedWeek)
                      );
                      const isSelected =
                        selectedSlot?.day === fullDate &&
                        selectedSlot?.time === time;
                      // Check if the time slot is booked
                      // This is now user-specific due to backend filtering
                      const isBooked = appointments?.some(
                        (appt) => appt.day === fullDate && appt.time === time
                      );
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`p-1 border cursor-pointer ${
                            isBooked
                              ? 'bg-red-200'
                              : isSelected
                                ? 'bg-blue-300'
                                : 'bg-white'
                          } hover:bg-blue-100 transition`}
                          onClick={() =>
                            !isBooked && handleSelect(fullDate, time)
                          }
                        ></div>
                      );
                    })}
                  </>
                ))}
              </div>
            ) : null}

            <div className='mt-4 text-sm text-gray-600'>
              <div className='flex items-center mb-1'>
                <div className='w-4 h-4 bg-white border mr-2'></div>
                <span>Available</span>
              </div>
              <div className='flex items-center mb-1'>
                <div className='w-4 h-4 bg-gray-300 border mr-2'></div>
                <span>Unavailable (past date or weekend)</span>
              </div>
              <div className='flex items-center'>
                <div className='w-4 h-4 bg-red-200 border mr-2'></div>
                <span>Booked</span>
              </div>
            </div>
          </>
        );

      case 2: // Time slot selection
        return (
          <div className='p-4'>
            <div className='mb-4'>
              <h3 className='text-lg font-semibold mb-2'>
                {t('step')} 2 {t('of')} 3: {t('select_time')}
              </h3>
              <p className='text-gray-600'>
                {t('selected_date')}: {selectedSlot?.day}
              </p>
              <p className='text-gray-600'>
                {t('selected_service')}: {t(serviceType)} (
                {serviceType === 'consultation'
                  ? '30'
                  : serviceType === 'treatment'
                    ? '60'
                    : '45'}{' '}
                min)
              </p>
            </div>

            {isLoadingTimeSlots ? (
              <div className='flex justify-center items-center h-40'>
                <p>{t('loading')}...</p>
              </div>
            ) : (
              <>
                <div className='mb-4'>
                  <h4 className='font-medium mb-2'>
                    {t('available_time_slots')}:
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          className='p-2 border rounded text-center hover:bg-blue-100 transition'
                          onClick={() =>
                            handleSelect(selectedSlot?.day || '', time)
                          }
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className='col-span-4 text-center text-gray-500'>
                        {t('no_available_slots')}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex justify-between mt-6'>
                  <button
                    className='px-4 py-2 border rounded hover:bg-gray-100'
                    onClick={() => goToStep(1)}
                  >
                    {t('back')}
                  </button>
                  {availableTimeSlots.length > 0 && (
                    <button
                      className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
                      disabled={true}
                    >
                      {t('continue')}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 3: // Client information form
        return (
          <div className='p-4'>
            <div className='mb-4'>
              <h3 className='text-lg font-semibold mb-2'>
                {t('step')} 3 {t('of')} 3: {t('your_information')}
              </h3>
              <p className='text-gray-600'>
                {t('selected_date')}: {selectedSlot?.day}
              </p>
              <p className='text-gray-600'>
                {t('selected_time')}: {selectedSlot?.time}
              </p>
              <p className='text-gray-600'>
                {t('selected_service')}: {t(serviceType)} (
                {serviceType === 'consultation'
                  ? '30'
                  : serviceType === 'treatment'
                    ? '60'
                    : '45'}{' '}
                min)
              </p>
            </div>

            <div className='flex justify-between mt-6'>
              <button
                className='px-4 py-2 border rounded hover:bg-gray-100'
                onClick={() => goToStep(2)}
              >
                {t('back')}
              </button>
              <button
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50'
                onClick={() => saveAppointment()}
              >
                {t('book_selected_appointment')}
              </button>
            </div>
          </div>
        );

      case 4: // Confirmation
        return (
          <div className='p-4'>
            <div className='text-center mb-6'>
              <div className='inline-block p-2 rounded-full bg-green-100 text-green-600 mb-2'>
                <FiCheckCircle size={32} />
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                {t('appointment_confirmed')}
              </h3>
              <p className='text-gray-600'>
                {t('appointment_success_message')}
              </p>
            </div>

            <div className='bg-gray-50 p-4 rounded border mb-6'>
              <h4 className='font-medium mb-2'>{t('appointment_details')}:</h4>
              <div className='grid grid-cols-1 gap-2'>
                <div className='flex items-start'>
                  <FiCalendar className='mt-1 mr-2 text-gray-500' />
                  <div>
                    <p className='font-medium'>{t('date')}</p>
                    <p>{confirmationData?.day}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <FiClock className='mt-1 mr-2 text-gray-500' />
                  <div>
                    <p className='font-medium'>{t('time')}</p>
                    <p>{confirmationData?.time}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <FiUser className='mt-1 mr-2 text-gray-500' />
                  <div>
                    <p className='font-medium'>{t('name')}</p>
                    <p>{confirmationData?.name}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <FiBriefcase className='mt-1 mr-2 text-gray-500' />
                  <div>
                    <p className='font-medium'>{t('service_type')}</p>
                    <p>{t(confirmationData?.service_type || '')}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className='text-sm text-gray-600 mb-6'>
              {t('confirmation_email_sent')} {confirmationData?.email}
            </p>

            <div className='flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4'>
              <button
                className='px-4 py-2 border rounded hover:bg-gray-100'
                onClick={resetBooking}
              >
                {t('book_another_appointment')}
              </button>
              <button
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                onClick={() => (window.location.href = '/')}
              >
                {t('return_to_home')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={'w-full max-w-3xl mx-auto p-4 bg-white shadow-md rounded'}>
      <h2 className='text-xl font-semibold mb-4'>{t('book_appointment')}</h2>

      {/* User Profile Card */}
      {(userDetails || isLoadingUserDetails) && (
        <div className='mb-6'>
          <UserProfileCard
            user={userDetails as UserDetails}
            loading={isLoadingUserDetails}
          />
        </div>
      )}

      {/* Progress indicator */}
      {currentStep < 4 && (
        <div className='mb-6'>
          <div className='flex justify-between mb-2'>
            <div className='text-sm font-medium'>
              {t('step')} {currentStep} {t('of')} 3
            </div>
            <div className='text-sm text-gray-500'>
              {currentStep === 1
                ? t('select_date')
                : currentStep === 2
                  ? t('select_time')
                  : currentStep === 3
                    ? t('your_information')
                    : ''}
            </div>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-blue-500 h-2 rounded-full transition-all duration-300'
              style={{width: `${(currentStep / 3) * 100}%`}}
            ></div>
          </div>
        </div>
      )}

      {renderStep()}
    </div>
  );
};

export default ClientAppointmentCalendar;
