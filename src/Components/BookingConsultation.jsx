import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import './BookingConsultation.css';
import FindDoctorSearch from './FindDoctorSearch/FindDoctorSearch';
import DoctorCard from './DoctorCard/DoctorCard';

const DOCTORS_URL = 'https://api.npoint.io/9a5543d36f1460da2f63';

const BookingConsultation = () => {
    const [searchParams] = useSearchParams();
    const speciality = searchParams.get('speciality');

    const [doctors, setDoctors] = useState([]);
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

    // Fetch once on mount. The speciality filter is derived below, so the list
    // doesn't need to be refetched when the URL changes.
    useEffect(() => {
        const controller = new AbortController();

        fetch(DOCTORS_URL, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setDoctors(data);
                setStatus('success');
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error(err);
                    setStatus('error');
                }
            });

        return () => controller.abort();
    }, []);

    // Derived from the URL and the fetched list, so it stays in sync without extra state
    const filteredDoctors = useMemo(() => {
        if (!speciality) return [];
        const target = speciality.toLowerCase();
        return doctors.filter((doctor) => doctor.speciality?.toLowerCase() === target);
    }, [doctors, speciality]);

    const renderResults = () => {
        if (!speciality) return null;

        if (status === 'loading') return <p>Loading doctors...</p>;
        if (status === 'error') return <p>Could not load doctors. Please try again later.</p>;

        return (
            <>
                <h2>
                    {filteredDoctors.length} doctors are available for {speciality}
                </h2>
                <h3>Book appointments with minimum wait-time & verified doctor details</h3>

                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <DoctorCard key={doctor.id ?? doctor.name} {...doctor} />
                    ))
                ) : (
                    <p>No doctors found.</p>
                )}
            </>
        );
    };

    return (
        <div className="searchpage-container" style={{ textAlign: 'center' }}>
            <FindDoctorSearch />
            <div className="search-results-container">{renderResults()}</div>
        </div>
    );
};

export default BookingConsultation;