import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './ProfileCard.css';

const PHONE_PATTERN = /^\+?[0-9\s-]{7,15}$/;

// Returns an error message for invalid details, or an empty string when valid
const validate = (details) => {
    if (!details.name?.trim()) return 'Name is required.';
    if (details.phone?.trim() && !PHONE_PATTERN.test(details.phone.trim())) {
        return 'Enter a valid phone number.';
    }
    return '';
};

const ProfileCard = () => {
    const [userDetails, setUserDetails] = useState({});
    const [updatedDetails, setUpdatedDetails] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    // Fetch the profile when the card mounts
    useEffect(() => {
        const authtoken = sessionStorage.getItem('auth-token');
        const email = sessionStorage.getItem('email');

        if (!authtoken) {
            navigate('/login');
            return;
        }

        const loadProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${authtoken}`,
                        Email: email,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch user profile');

                const user = await response.json();
                setUserDetails(user);
                setUpdatedDetails(user);
            } catch (err) {
                console.error(err);
                setError('We could not load your profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleEdit = () => {
        // Start editing from the saved values so cancel can restore them
        setUpdatedDetails(userDetails);
        setError('');
        setStatus('');
        setEditMode(true);
    };

    const handleCancel = () => {
        setUpdatedDetails(userDetails);
        setError('');
        setEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate(updatedDetails);
        if (validationError) {
            setError(validationError);
            return;
        }

        const authtoken = sessionStorage.getItem('auth-token');
        const email = sessionStorage.getItem('email');
        if (!authtoken || !email) {
            navigate('/login');
            return;
        }

        const payload = {
            name: updatedDetails.name.trim(),
            phone: (updatedDetails.phone ?? '').trim(),
        };

        setSaving(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/api/auth/user`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authtoken}`,
                    'Content-Type': 'application/json',
                    Email: email,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to update profile');

            const saved = { ...userDetails, ...payload };
            sessionStorage.setItem('name', saved.name);
            sessionStorage.setItem('phone', saved.phone);

            setUserDetails(saved);
            setUpdatedDetails(saved);
            setEditMode(false);
            setStatus('Profile updated successfully.');
        } catch (err) {
            console.error(err);
            setError('We could not save your changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <p>Loading your profile…</p>
            </div>
        );
    }

    const profileLoaded = Boolean(userDetails.email);

    return (
        <div className="profile-container">
            {editMode ? (
                <form onSubmit={handleSubmit} noValidate>
                    <h1>Edit profile</h1>

                    {error && <p className="profile-error" role="alert">{error}</p>}

                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={updatedDetails.name ?? ''}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Phone
                        <input
                            type="text"
                            name="phone"
                            value={updatedDetails.phone ?? ''}
                            onChange={handleInputChange}
                        />
                    </label>

                    <label>
                        Email
                        <input type="email" name="email" value={userDetails.email ?? ''} disabled />
                    </label>

                    <button type="submit" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                        type="button"
                        className="profile-secondary"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="profile-details">
                    {profileLoaded ? (
                        <>
                            <h1>Welcome, {userDetails.name}</h1>

                            {status && <p className="profile-status" role="status">{status}</p>}
                            {error && <p className="profile-error" role="alert">{error}</p>}

                            <p><b>Email:</b> {userDetails.email}</p>
                            <p><b>Phone:</b> {userDetails.phone || 'Not added yet'}</p>

                            <button onClick={handleEdit}>Edit</button>
                        </>
                    ) : (
                        <>
                            <h1>Your profile</h1>
                            <p className="profile-error" role="alert">{error}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileCard;