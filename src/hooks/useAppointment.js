import { useContext } from 'react';
import { AppointmentContext } from '../context/AppointmentContext';

export const useAppointment = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointment must be used inside AppointmentProvider');
    }
    return context;
};