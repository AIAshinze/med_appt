import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { appointmentSchema, TIME_SLOTS, getDateBounds } from './appointmentSchema';

const FieldError = ({ id, message }) =>
    message ? (
        <p id={id} role="alert" style={{ color: 'red', fontSize: '0.85rem', margin: '4px 0 0' }}>
            {message}
        </p>
    ) : null;

const AppointmentForm = ({ doctorName, doctorSpeciality, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(appointmentSchema),
        defaultValues: { name: '', phoneNumber: '', date: '', slot: '' },
    });

    const { min, max } = getDateBounds();

    // Only called when validation passes. `data` has trimmed, typed values.
    const onValid = (data) => {
        onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onValid)} className="appointment-form" noValidate>
            {doctorName && (
                <p>
                    Booking with <strong>{doctorName}</strong>
                    {doctorSpeciality && ` (${doctorSpeciality})`}
                </p>
            )}

            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    type="text"
                    {...register('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                <FieldError id="name-error" message={errors.name?.message} />
            </div>

            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    id="phoneNumber"
                    type="tel"
                    {...register('phoneNumber')}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
                />
                <FieldError id="phone-error" message={errors.phoneNumber?.message} />
            </div>

            <div className="form-group">
                <label htmlFor="date">Appointment Date:</label>
                <input
                    id="date"
                    type="date"
                    min={min}
                    max={max}
                    {...register('date')}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                />
                <FieldError id="date-error" message={errors.date?.message} />
            </div>

            <div className="form-group">
                <label htmlFor="slot">Select a Slot:</label>
                <select
                    id="slot"
                    {...register('slot')}
                    aria-invalid={Boolean(errors.slot)}
                    aria-describedby={errors.slot ? 'slot-error' : undefined}
                >
                    <option value="">-- Select a Slot --</option>
                    {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
                <FieldError id="slot-error" message={errors.slot?.message} />
            </div>

            <button type="submit" disabled={isSubmitting}>
                Book Now
            </button>
        </form>
    );
};

export default AppointmentForm;