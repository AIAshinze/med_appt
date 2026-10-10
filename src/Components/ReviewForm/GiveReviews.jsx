import { useState, useMemo } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useAppointment } from '../../hooks/useAppointment';
import './ReviewForm.css';

const DEFAULT_DOCTORS = [
    { id: 1, name: 'Dr. Denis Raj', speciality: 'Dentistry' },
    { id: 2, name: 'Dr. Richard Lee', speciality: 'Dermatology' },
];

const RATING_VALUES = [1, 2, 3, 4, 5];

const loadStoredReviews = () => {
    const stored = {};
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('reviewFormData_')) {
                const docId = key.replace('reviewFormData_', '');
                stored[docId] = JSON.parse(localStorage.getItem(key));
            }
        }
    } catch {
        // ignore
    }
    return stored;
};

export const GiveReviews = () => {
    const { booking } = useAppointment();
    const [reviews, setReviews] = useState(loadStoredReviews);
    const [activeDoctor, setActiveDoctor] = useState(null);
    const [formData, setFormData] = useState({ name: '', review: '', rating: 0 });
    const [showWarning, setShowWarning] = useState(false);

    const doctors = useMemo(() => {
        if (booking?.doctor?.name) {
            const exists = DEFAULT_DOCTORS.some((d) => d.name === booking.doctor.name);
            if (!exists) {
                return [
                    ...DEFAULT_DOCTORS,
                    {
                        id: 3,
                        name: booking.doctor.name,
                        speciality: booking.doctor.speciality || 'General Medicine',
                    },
                ];
            }
        }
        return DEFAULT_DOCTORS;
    }, [booking]);

    const handleOpenForm = (doctor) => {
        setActiveDoctor(doctor);
        const existingReview = reviews[doctor.id];
        if (existingReview) {
            setFormData(existingReview);
        } else {
            const storedName = sessionStorage.getItem('name') || '';
            setFormData({ name: storedName, review: '', rating: 0 });
        }
        setShowWarning(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextValue = name === 'rating' ? Number(value) : value;
        setFormData((prev) => ({ ...prev, [name]: nextValue }));
    };

    const handleSubmit = (e, close) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.review.trim() || formData.rating === 0) {
            setShowWarning(true);
            return;
        }

        const newReview = {
            name: formData.name.trim(),
            review: formData.review.trim(),
            rating: formData.rating,
        };

        const updated = { ...reviews, [activeDoctor.id]: newReview };
        setReviews(updated);
        localStorage.setItem(`reviewFormData_${activeDoctor.id}`, JSON.stringify(newReview));
        setShowWarning(false);
        setActiveDoctor(null);
        if (close) close();
    };

    return (
        <div className="reviews-page" style={{ maxWidth: '1000px', margin: '80px auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#0d213f' }}>Reviews</h2>
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#2190FF', color: '#fff' }}>
                            <th style={{ padding: '14px 16px' }}>S.No.</th>
                            <th style={{ padding: '14px 16px' }}>Doctor Name</th>
                            <th style={{ padding: '14px 16px' }}>Doctor Speciality</th>
                            <th style={{ padding: '14px 16px' }}>Provide Feedback</th>
                            <th style={{ padding: '14px 16px' }}>Review Given</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor, index) => {
                            const review = reviews[doctor.id];
                            const isSubmitted = Boolean(review);

                            return (
                                <tr key={doctor.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <td style={{ padding: '14px 16px' }}>{index + 1}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{doctor.name}</td>
                                    <td style={{ padding: '14px 16px' }}>{doctor.speciality}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <Popup
                                            trigger={
                                                <button
                                                    className="btn btn-primary"
                                                    disabled={isSubmitted}
                                                    style={{
                                                        padding: '8px 16px',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        cursor: isSubmitted ? 'not-allowed' : 'pointer',
                                                        backgroundColor: isSubmitted ? '#e0e0e0' : '#2190FF',
                                                        color: isSubmitted ? '#888' : '#fff',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {isSubmitted ? 'Submitted' : 'Click Here'}
                                                </button>
                                            }
                                            modal
                                            nested
                                            onOpen={() => handleOpenForm(doctor)}
                                        >
                                            {(close) => (
                                                <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', maxWidth: '450px', margin: 'auto' }}>
                                                    <h3 style={{ marginTop: 0, color: '#0d213f' }}>Give Your Feedback</h3>
                                                    <p style={{ color: '#666', marginTop: '-5px' }}>for {doctor.name} ({doctor.speciality})</p>
                                                    {showWarning && (
                                                        <p style={{ color: 'red', fontSize: '0.9rem' }}>Please fill out all fields.</p>
                                                    )}
                                                    <form onSubmit={(e) => handleSubmit(e, close)}>
                                                        <div style={{ marginBottom: '14px' }}>
                                                            <label htmlFor="name" style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>
                                                                Name:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                                            />
                                                        </div>

                                                        <div style={{ marginBottom: '14px' }}>
                                                            <label htmlFor="review" style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>
                                                                Review:
                                                            </label>
                                                            <textarea
                                                                id="review"
                                                                name="review"
                                                                rows="4"
                                                                value={formData.review}
                                                                onChange={handleChange}
                                                                style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                                            />
                                                        </div>

                                                        <div style={{ marginBottom: '18px' }}>
                                                            <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>Rating:</label>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                {RATING_VALUES.map((val) => (
                                                                    <button
                                                                        type="button"
                                                                        key={val}
                                                                        onClick={() => setFormData((p) => ({ ...p, rating: val }))}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            border: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: '24px',
                                                                            color: val <= formData.rating ? '#FFB800' : '#D0D0D0',
                                                                            padding: 0,
                                                                        }}
                                                                        aria-label={`${val} star`}
                                                                    >
                                                                        ★
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                            <button
                                                                type="button"
                                                                onClick={close}
                                                                style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                style={{ padding: '8px 18px', borderRadius: '4px', border: 'none', background: '#2190FF', color: '#fff', cursor: 'pointer' }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </Popup>
                                    </td>
                                    <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                                        {review ? (
                                            <div>
                                                <div style={{ color: '#FFB800', marginBottom: '4px' }}>
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', color: '#333' }}>"{review.review}"</div>
                                                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '2px' }}>— {review.name}</div>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#aaa', fontStyle: 'italic' }}>No review yet</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GiveReviews;