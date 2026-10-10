import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import AppointmentForm from '../AppointmentForm/AppointmentForm';
import { useAppointment } from '../../hooks/useAppointment';
import './DoctorCard.css';

const MODAL_STYLE = { height: '100vh', overflow: 'scroll' };

const PersonIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="46"
        height="46"
        fill="currentColor"
        className="bi bi-person-fill"
        viewBox="0 0 16 16"
    >
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    </svg>
);

const DoctorDetails = ({ name, speciality, experience, ratings }) => (
    <>
        <div className="doctor-card-profile-image-container">
            <PersonIcon />
        </div>
        <div className="doctor-card-details">
            <div className="doctor-card-detail-name">{name}</div>
            <div className="doctor-card-detail-speciality">{speciality}</div>
            <div className="doctor-card-detail-experience">{experience} years experience</div>
            <div className="doctor-card-detail-consultationfees">Ratings: {ratings}</div>
        </div>
    </>
);

const DoctorCard = ({ name, speciality, experience, ratings }) => {
    const { booking, bookAppointment, cancelAppointment } = useAppointment();

    // This card owns the booking only if the saved booking is for this doctor
    const isBookedHere = booking?.doctor.name === name;
    const appointment = isBookedHere ? booking.appointment : null;
    const bookedElsewhere = Boolean(booking) && !isBookedHere;

    const handleFormSubmit = (data, close) => {
        bookAppointment({ name, speciality }, data);
        close();
    };

    return (
        <div className="doctor-card-container">
            <div className="doctor-card-details-container">
                <DoctorDetails name={name} speciality={speciality} experience={experience} ratings={ratings} />
            </div>

            <div className="doctor-card-options-container">
                <Popup
                    modal
                    contentStyle={{ backgroundColor: '#FFFFFF' }}
                    trigger={
                        <button className={`book-appointment-btn ${appointment ? 'cancel-appointment' : ''}`}>
                            <div>{appointment ? 'Manage Appointment' : 'Book Appointment'}</div>
                            <div>No Booking Fee</div>
                        </button>
                    }
                >
                    {(close) => (
                        <div className="doctorbg" style={MODAL_STYLE}>
                            <div>
                                <DoctorDetails name={name} speciality={speciality} experience={experience} ratings={ratings} />
                            </div>

                            {appointment ? (
                                <div className="bookedInfo">
                                    <h3 style={{ textAlign: 'center' }}>Appointment Booked!</h3>
                                    <p>Name: {appointment.name}</p>
                                    <p>Phone Number: {appointment.phoneNumber}</p>
                                    <p>Date: {appointment.date}</p>
                                    <p>Time: {appointment.slot}</p>
                                    <button onClick={cancelAppointment}>Cancel Appointment</button>
                                </div>
                            ) : bookedElsewhere ? (
                                <p style={{ textAlign: 'center' }}>
                                    You already have an appointment with {booking.doctor.name}. Cancel it before
                                    booking another.
                                </p>
                            ) : (
                                <AppointmentForm
                                    doctorName={name}
                                    doctorSpeciality={speciality}
                                    onSubmit={(data) => handleFormSubmit(data, close)}
                                />
                            )}
                        </div>
                    )}
                </Popup>
            </div>
        </div>
    );
};

export default DoctorCard;