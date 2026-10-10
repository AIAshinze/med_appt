import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Sign_Up.css';
import { API_URL } from '../../config';

const SignUp = () => {
    // State variables using useState hook
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // State to show error messages
    const navigate = useNavigate(); // Navigation hook from react-router

    const register = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setShowerr(''); // Clear any previous error

        if (phone.length !== 10) {
            setShowerr('Phone number must be 10 digits.');
            return;
        }

        try {
            // API Call to register user
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const json = await response.json(); // Parse the response JSON

            if (json.authtoken) {
                // Store user data in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', name);
                sessionStorage.setItem('phone', phone);
                sessionStorage.setItem('email', email);

                // Redirect user to home page
                navigate('/');
                window.location.reload(); // Refresh so the Navbar picks up the new session
            } else if (json.errors) {
                // Show the first validation message
                setShowerr(json.errors[0]?.msg || 'Registration failed.');
            } else {
                setShowerr(json.error || 'Registration failed.');
            }
        } catch {
            setShowerr('Could not reach the server. Please try again.');
        }
    };

    // Clear the controlled inputs when the form is reset
    const handleReset = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setShowerr('');
    };

    return (
        <div className="container" style={{ marginTop: '5%' }}>
            {/* Main container with margin-top */}
            <div className="signup-grid">
                {/* Grid layout for sign-up form */}
                <div className="signup-text">
                    {/* Title for the sign-up form */}
                    <h1>Sign Up</h1>
                </div>
                <div className="signup-text1" style={{ textAlign: 'left' }}>
                    {/* Text for existing members to log in */}
                    Already a member?
                    <span>
                        <Link to="/login" style={{ color: '#2190ff' }}>
                            Login
                        </Link>
                    </span>
                </div>
                <div className="signup-form">
                    {/* Form for user sign-up */}
                    <form onSubmit={register} onReset={handleReset}>
                        {/* Show error messages from the server */}
                        {showerr && (
                            <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
                                {showerr}
                            </div>
                        )}
                        {/* Form group for user's name */}
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                                placeholder="Enter your name"
                                aria-describedby="helpId"
                            />
                        </div>
                        {/* Form group for user's phone number */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="form-control"
                                placeholder="Enter your phone number"
                                aria-describedby="helpId"
                            />
                        </div>
                        {/* Form group for user's email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="Enter your email"
                                aria-describedby="helpId"
                            />
                        </div>
                        {/* Form group for user's password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="Enter your password"
                                aria-describedby="helpId"
                            />
                        </div>
                        {/* Button group for form submission and reset */}
                        <div className="btn-group">
                            <button type="submit" className="btn btn-primary mb-2 mr-1 waves-effect waves-light">
                                Submit
                            </button>
                            <button type="reset" className="btn btn-danger mb-2 waves-effect waves-light">
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;