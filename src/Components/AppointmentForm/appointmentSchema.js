import { z } from 'zod';

export const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];
export const MAX_DAYS_AHEAD = 60;

// Formats a Date as YYYY-MM-DD in local time. toISOString() uses UTC and can shift the day.
export const toDateInputValue = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// Returns the earliest and latest bookable dates. Call this at render time so the
// range stays correct if the page stays open past midnight.
export const getDateBounds = () => {
    const max = new Date();
    max.setDate(max.getDate() + MAX_DAYS_AHEAD);
    return {
        min: toDateInputValue(new Date()),
        max: toDateInputValue(max),
    };
};

export const appointmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters.')
        .regex(/^[\p{L}\s.'-]+$/u, 'Name can only contain letters, spaces, periods, apostrophes, and hyphens.'),

    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?[\d\s()-]+$/, 'Enter a valid phone number.')
        .refine((value) => {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15;
        }, 'Phone number must have 7 to 15 digits.'),

    // YYYY-MM-DD strings compare correctly as plain strings
    date: z
        .string()
        .min(1, 'Please select a date.')
        .refine((value) => value >= getDateBounds().min, 'Appointments cannot be booked for a past date.')
        .refine(
            (value) => value <= getDateBounds().max,
            `You can book up to ${MAX_DAYS_AHEAD} days in advance.`
        ),

    slot: z.enum(TIME_SLOTS, { message: 'Please select a time slot.' }),
});