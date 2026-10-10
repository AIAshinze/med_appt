import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import './FindDoctorSearch.css';

const SPECIALITIES = [
    'Dentist',
    'Gynecologist/obstetrician',
    'General Physician',
    'Dermatologist',
    'Ear-nose-throat (ent) Specialist',
    'Homeopath',
    'Ayurveda',
];

const FindDoctorSearch = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Filter the list by what the user has typed. An empty query shows everything.
    const term = query.trim().toLowerCase();
    const matches = SPECIALITIES.filter((speciality) => speciality.toLowerCase().includes(term));

    const handleSelect = (speciality) => {
        setQuery(speciality);
        setIsOpen(false);
        if (onSearch) {
            onSearch(speciality);
        } else {
            const currentPath = location.pathname.includes('instant-consultation')
                ? '/instant-consultation'
                : (location.pathname === '/' ? '/booking-consultation' : location.pathname);
            navigate(`${currentPath}?speciality=${encodeURIComponent(speciality)}`);
        }
    };

    // Close the results only when focus leaves the whole search box, not when it
    // moves from the input to a result button
    const handleBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    return (
        <div className="finddoctor">
            <div style={{ textAlign: 'center' }}>
                <h1>Find a doctor and Consult instantly</h1>
                <div>
                    <i style={{ color: '#000000', fontSize: '20rem' }} className="fa fa-user-md"></i>
                </div>

                <div
                    className="home-search-container"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <div className="doctor-search-box" onBlur={handleBlur}>
                        <input
                            type="text"
                            className="search-doctor-input-box"
                            placeholder="Search doctors, clinics, hospitals, etc."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsOpen(true)}
                            aria-expanded={isOpen}
                            aria-controls="speciality-results"
                            role="combobox"
                            autoComplete="off"
                        />

                        <div className="findiconimg">
                            <i className="fa fa-search" style={{ fontSize: '18px', color: '#999' }}></i>
                        </div>

                        <div
                            id="speciality-results"
                            className="search-doctor-input-results"
                            hidden={!isOpen || matches.length === 0}
                        >
                            {matches.map((speciality) => (
                                <button
                                    type="button"
                                    key={speciality}
                                    className="search-doctor-result-item"
                                    onClick={() => handleSelect(speciality)}
                                >
                                    <span>
                                        <i className="fa fa-search" style={{ fontSize: '18px', color: '#999' }}></i>
                                    </span>
                                    <span>{speciality}</span>
                                    <span>SPECIALITY</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindDoctorSearch;