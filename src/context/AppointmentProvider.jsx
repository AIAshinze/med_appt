import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppointmentContext } from './AppointmentContext';

const STORAGE_KEY = 'booking';

const readStoredBooking = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
    } catch {
        return null;
    }
};

const AppointmentProvider = ({ children }) => {
    const [booking, setBooking] = useState(readStoredBooking);

    // Persist to localStorage whenever the booking changes
    useEffect(() => {
        if (booking) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [booking]);

    // Keep other open tabs in sync
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === STORAGE_KEY) setBooking(readStoredBooking());
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const bookAppointment = useCallback((doctor, appointment) => {
        setBooking({
            doctor: { name: doctor.name, speciality: doctor.speciality },
            appointment,
        });
    }, []);

    const cancelAppointment = useCallback(() => setBooking(null), []);

    const value = useMemo(
        () => ({ booking, bookAppointment, cancelAppointment }),
        [booking, bookAppointment, cancelAppointment]
    );

    return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export { AppointmentProvider };
export default AppointmentProvider;