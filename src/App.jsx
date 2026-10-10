import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './Components/Navbar/Navbar';
import LandingPage from './Components/Landing_Page/LandingPage';
import Login from './Components/Login/Login';
import SignUp from './Components/Sign_Up/SignUp';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import BookingConsultation from './Components/BookingConsultation';
import { AppointmentProvider } from './context/AppointmentProvider';
import Notification from './Components/Notification/Notification';
import GiveReviews from './Components/ReviewForm/ReviewForm';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import ReportsLayout from './Components/ReportsLayout/ReportsLayout';
import './App.css';

// Function component for the main App
function App() {
  return (
    <div className="App">
      {/* Set up BrowserRouter for routing */}
      <BrowserRouter>
        <AppointmentProvider>
          {/* Display the Navbar component */}
          <Navbar />
          {/* Display the Notification component */}
          <Notification />
          {/* Set up the Routes for different pages */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/instant-consultation" element={<InstantConsultation />} />
            <Route path="/booking-consultation" element={<BookingConsultation />} />
            <Route path="/search/doctors" element={<BookingConsultation />} />
            <Route path="/reviews" element={<GiveReviews />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/reports" element={<ReportsLayout />} />
          </Routes>
        </AppointmentProvider>
      </BrowserRouter>
    </div>
  );
}

// Export the App component as the default export
export default App;
