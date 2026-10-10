import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const isLoggedIn = Boolean(sessionStorage.getItem("auth-token"));
    const name = sessionStorage.getItem("name") || "";
    const email = sessionStorage.getItem("email") || "";

    const closeMenus = () => {
        setIsMenuOpen(false);
        setShowDropdown(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("phone");
        localStorage.removeItem("doctorData");

        // Collect the keys first, because removing items while looping
        // by index skips entries
        Object.keys(localStorage)
            .filter((key) => key.startsWith("reviewFormData_"))
            .forEach((key) => localStorage.removeItem(key));

        setShowDropdown(false);
        navigate("/");
    };

    const displayName = name || (email ? email.split('@')[0] : 'User');

    return (
        <nav>
            <div className="nav__logo">
                <Link to="/" onClick={closeMenus}>
                    StayHealthy <i style={{ color: "#2190FF" }} className="fa fa-user-md"></i>
                </Link>
                <span>.</span>
            </div>

            <div className="nav__icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <i className={isMenuOpen ? "fa fa-times" : "fa fa-bars"}></i>
            </div>

            <ul className={isMenuOpen ? "nav__links active" : "nav__links"}>
                <li className="link">
                    <Link to="/" onClick={closeMenus}>Home</Link>
                </li>
                <li className="link">
                    <Link to="/booking-consultation" onClick={closeMenus}>Appointments</Link>
                </li>
                <li className="link">
                    <Link to="/instant-consultation" onClick={closeMenus}>Instant Consultation</Link>
                </li>
                <li className="link">
                    <Link to="/reviews" onClick={closeMenus}>Reviews</Link>
                </li>

                {isLoggedIn ? (
                    <>
                        <li className="link welcome-user" onClick={() => setShowDropdown(!showDropdown)}>
                            <span style={{ cursor: 'pointer', fontWeight: 600 }}>
                                Welcome, {displayName} <i className="fa fa-caret-down"></i>
                            </span>
                            <ul className="dropdown-menu" style={showDropdown ? { display: 'block' } : {}}>
                                <li>
                                    <Link to="/profile" onClick={closeMenus}>Your Profile</Link>
                                </li>
                                <li>
                                    <Link to="/reports" onClick={closeMenus}>Your Reports</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="link">
                            <button className="btn2" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="link">
                            <Link to="/signup" className="btn1" onClick={closeMenus}>
                                Sign Up
                            </Link>
                        </li>
                        <li className="link">
                            <Link to="/login" className="btn1" onClick={closeMenus}>
                                Login
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;