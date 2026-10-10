import { useState } from 'react';
import { useAppointment } from '../../hooks/useAppointment';
import './Notification.css';

// Turns a YYYY-MM-DD string into a readable date. Parsing the parts separately
// keeps the day from shifting by one in timezones behind UTC.
const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Identifies a specific booking, so a new booking can show the card again
const getBookingKey = (booking) =>
    booking ? `${booking.doctor.name}|${booking.appointment.date}|${booking.appointment.slot}` : null;

const Notification = ({ children }) => {
    const { booking } = useAppointment();
    const isLoggedIn = Boolean(sessionStorage.getItem('auth-token'));

    const bookingKey = getBookingKey(booking);

    // Controls whether the card is shown. The user can close it with the button.
    const [isVisible, setIsVisible] = useState(true);

    // Remember which booking the visibility applies to. When a different booking
    // arrives, show the card again. Updating state during render like this is the
    // React-recommended alternative to a useEffect.
    const [shownKey, setShownKey] = useState(bookingKey);
    if (bookingKey !== shownKey) {
        setShownKey(bookingKey);
        setIsVisible(true);
    }

    const showCard = isLoggedIn && Boolean(booking) && isVisible;

    return (
        <>
            {children}

            {showCard && (
                <div className="notification" role="status" aria-live="polite">
                    <div className="notification__header">
                        <h3 className="notification__title">Appointment Booked</h3>
                        <button
                            type="button"
                            className="notification__close"
                            onClick={() => setIsVisible(false)}
                            aria-label="Dismiss notification"
                        >
                            &times;
                        </button>
                    </div>

                    <dl className="notification__details">
                        <dt>Booked by</dt>
                        <dd>{booking.appointment.name}</dd>

                        <dt>Doctor</dt>
                        <dd>{booking.doctor.name}</dd>

                        <dt>Date</dt>
                        <dd>{formatDate(booking.appointment.date)}</dd>

                        <dt>Time</dt>
                        <dd>{booking.appointment.slot}</dd>
                    </dl>
                </div>
            )}
        </>
    );
};

export default Notification;