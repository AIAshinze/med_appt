# StayHealthy — Medical Consultation & Appointment Booking Platform

**StayHealthy** is a full-stack healthcare web application designed to connect patients with certified medical specialists. The platform supports both rapid, same-day **Instant Consultations** and scheduled **Appointment Bookings**, alongside user profile management, doctor reviews, persistent appointment notifications, and downloadable medical consultation reports.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Component Breakdown](#component-breakdown)
- [Backend API Reference](#backend-api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Building and Linting](#building-and-linting)
- [State Management & Data Persistence](#state-management--data-persistence)

---

## Key Features

- **Dynamic Navigation Bar**: Responsive header featuring branding, direct navigation links, session-aware authentication status, and an account dropdown for Profile, Reports, and Logout.
- **User Authentication**:
  - **Sign Up**: Full registration form with 10-digit phone validation and secure password handling.
  - **Login**: Token-based authentication using JWT and persistent session storage.
  - **Session Management**: Automatically extracts and displays the username, supporting single-click logout that clears session data and doctor bookings.
- **Instant Consultation Booking**:
  - Specialty-based filtering (Dentistry, Dermatology, General Physician, etc.).
  - Rapid booking flow requiring only patient name and phone number.
  - Instant popup confirmation modal and cancellation toggle.
- **Scheduled Appointment Booking**:
  - Filter doctors by specialty with real-time suggestions and focus-blur controls.
  - Advanced appointment form capturing patient name, phone number, appointment date (up to 60 days in advance), and time slot.
  - Validation powered by Zod and React Hook Form.
- **Global Appointment Notification**:
  - Persistent alert displayed across all application routes when an appointment is booked.
  - Automatically updates and disappears when the appointment is cancelled.
- **Consultation Reviews & Ratings**:
  - Tabular list of consultations showing doctor names and specialties.
  - Interactive 5-star rating selector and feedback modal.
  - Post-submission state locking (disables the feedback button once submitted) and persistence via `localStorage`.
- **User Profile Management**:
  - Secure profile retrieval via backend API using authentication token and email headers.
  - Toggleable edit mode allowing updates to Name and Phone while keeping Email locked.
- **Patient Reports Dashboard**:
  - Tabular view of consultation reports.
  - In-browser PDF report preview and direct download attribute functionality (`patient_report.pdf`).

---

## Tech Stack

### Frontend

- **React 19**
- **Vite** (Build tool & development server)
- **React Router DOM v7** (Client-side routing)
- **React Hook Form & Zod** (Form validation and schema enforcement)
- **reactjs-popup** (Modal and popup dialogs)
- **CSS3 / Flexbox / CSS Grid** (Responsive layouts)

### Backend

- **Node.js & Express.js**
- **MongoDB & Mongoose** (User schema & persistence)
- **JSON Web Tokens (JWT)** (Secure token generation and verification)
- **bcryptjs** (Password hashing and salt generation)
- **express-validator** (API request validation)
- **cors & dotenv** (Cross-Origin Resource Sharing and environment configuration)

---

## Project Architecture & Directory Structure

```text
med_appt/
├── public/                                # Static public assets
│   ├── favicon.svg                        # StayHealthy browser and app icon
│   ├── site.webmanifest                   # Installable app metadata
│   ├── icons.svg
│   └── patient_report.pdf                # Sample consultation report PDF for download/view
├── server/                                # Node.js Express backend server
│   ├── models/
│   │   └── User.js                       # Mongoose User model
│   ├── routes/
│   │   └── auth.js                       # Authentication & user profile endpoints
│   ├── db.js                             # MongoDB connection setup
│   ├── index.js                          # Express app entrypoint (Port 8181)
│   └── package.json
├── src/                                  # React frontend source code
│   ├── assets/                           # Media and vector assets
│   ├── Components/
│   │   ├── AppointmentForm/              # Scheduled booking form with Zod schema
│   │   │   ├── AppointmentForm.jsx
│   │   │   └── appointmentSchema.js
│   │   ├── BookingConsultation.jsx       # Scheduled consultation doctor listing
│   │   ├── BookingConsultation.css
│   │   ├── DoctorCard/                   # Doctor credentials card & appointment modal
│   │   │   ├── DoctorCard.jsx
│   │   │   └── DoctorCard.css
│   │   ├── FindDoctorSearch/             # Specialty search input with suggestions
│   │   │   ├── FindDoctorSearch.jsx
│   │   │   └── FindDoctorSearch.css
│   │   ├── InstantConsultationBooking/   # Instant consultation module
│   │   │   ├── AppointmentFormIC/        # Rapid 2-field booking form
│   │   │   ├── DoctorCardIC/             # Instant doctor card with instant booking
│   │   │   ├── FindDoctorSearchIC/       # Instant specialty search
│   │   │   ├── InstantConsultation.jsx
│   │   │   └── InstantConsultation.css
│   │   ├── Landing_Page/                 # Home hero section
│   │   │   ├── LandingPage.jsx
│   │   │   └── LandingPage.css
│   │   ├── Login/                        # Login form component
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   ├── Navbar/                       # Header navigation bar with dropdown
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Notification/                 # Persistent appointment notification banner
│   │   │   ├── Notification.jsx
│   │   │   └── Notification.css
│   │   ├── ProfileCard/                  # User profile card with inline edit mode
│   │   │   ├── ProfileCard.jsx
│   │   │   └── ProfileCard.css
│   │   ├── ReportsLayout/                # Patient medical reports table
│   │   │   ├── ReportsLayout.jsx
│   │   │   └── ReportsLayout.css
│   │   ├── ReviewForm/                   # Consultation reviews table & feedback modal
│   │   │   ├── GiveReviews.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewForm.css
│   │   └── Sign_Up/                      # Registration form with phone validation
│   │       ├── SignUp.jsx
│   │       ├── Sign_Up.jsx
│   │       └── Sign_Up.css
│   ├── context/                          # React Context API
│   │   ├── AppointmentContext.js
│   │   └── AppointmentProvider.jsx       # Global appointment state & storage sync
│   ├── hooks/
│   │   └── useAppointment.js             # Custom hook to access AppointmentContext
│   ├── App.jsx                           # Application routing & provider composition
│   ├── App.css
│   ├── config.js                         # API URL endpoint configuration
│   ├── index.css
│   └── main.jsx                          # React application root entrypoint
├── package.json
└── vite.config.js
```

---

## Component Breakdown

| Component | Route | Description |
| :--- | :--- | :--- |
| **Navbar** | *(Global)* | Fixed header with navigation links, dynamic welcome greeting (`Welcome, <user>`), dropdown menu for Profile/Reports, and Logout button. |
| **LandingPage** | `/` | Hero section featuring tagline (*"Your Health, Our Responsibility"*), background design elements, and a call-to-action button. |
| **SignUp** | `/signup`, `/sign-up` | New user registration form validating email format, 10-digit phone number, password length, and handling duplicate email responses. |
| **Login** | `/login` | User login form sending POST requests to `/api/auth/login`, persisting authentication tokens, and redirecting authenticated users. |
| **InstantConsultation** | `/instant-consultation` | Same-day doctor consultation listing; captures only Name and Phone number for immediate assistance. |
| **BookingConsultation** | `/booking-consultation`, `/search/doctors` | Full appointment booking system allowing patients to search doctors, view ratings/experience, and pick dates/time slots. |
| **Notification** | *(Global)* | Floating card alerting patients to upcoming bookings (Doctor name, Patient name, Date, and Time). Automatically synchronizes upon cancellation. |
| **GiveReviews** | `/reviews` | Table of past consultations with interactive star rating and feedback modal. Disables the button once feedback is submitted. |
| **ProfileCard** | `/profile` | Displays account details fetched from the database with an edit toggle for updating Name and Phone number. |
| **ReportsLayout** | `/reports` | Dashboard showing medical reports with links to view in a new tab or download as `patient_report.pdf`. |

---

## Backend API Reference

Base URL: `http://localhost:8181`

### Authentication & User Endpoints (`/api/auth`)

| Method | Endpoint | Headers | Body Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `Content-Type: application/json` | `name`, `email`, `password`, `phone` | Registers a new user. Returns `{ authtoken }`. |
| `POST` | `/api/auth/login` | `Content-Type: application/json` | `email`, `password` | Authenticates user credentials. Returns `{ authtoken }`. |
| `GET` | `/api/auth/user` | `Authorization: Bearer <token>`, `Email: <email>` | *None* | Retrieves user profile data (`name`, `email`, `phone`, `role`). |
| `PUT` | `/api/auth/user` | `Authorization: Bearer <token>`, `Email: <email>`, `Content-Type: application/json` | `name`, `phone` | Updates user's name and phone number in MongoDB. |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd med_appt
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Install backend dependencies**:

   ```bash
   cd server
   npm install
   cd ..
   ```

---

### Running the Application

1. **Start the backend server**:
   Ensure MongoDB is running, then open a terminal in the `server` directory:

   ```bash
   cd server
   node index.js
   ```

   *The server runs on [http://localhost:8181](http://localhost:8181).*

2. **Start the frontend client**:
   In a separate terminal at the project root:

   ```bash
   npm run dev
   ```

   *The Vite development server will start (default: [http://localhost:5173](http://localhost:5173)).*

---

### Building and Linting

- **Build client bundle for production**:

  ```bash
  npm run build
  ```

- **Build and run the production client with Docker**:

  ```bash
  docker build -t stayhealthy .
  docker run --rm -p 3000:3000 stayhealthy
  ```

  *The production client will be available at [http://localhost:3000](http://localhost:3000).*

- **Preview production build**:

  ```bash
  npm run preview
  ```

- **Run ESLint checks**:

  ```bash
  npm run lint
  ```

---

## State Management & Data Persistence

- **Session Storage (`sessionStorage`)**:
  - `auth-token`: Stores the JWT returned on login or registration.
  - `email`: Logged-in user's email address.
  - `name`: User's display name or username derived from email.
  - `phone`: User's contact number.
- **Local Storage (`localStorage`)**:
  - `booking`: Stores active scheduled appointment data (doctor details, date, time slot, patient info) shared between `BookingConsultation`, `DoctorCard`, and `Notification`.
  - `reviewFormData_<id>`: Persists submitted reviews and ratings per doctor across page refreshes.
- **React Context (`AppointmentProvider`)**:
  - Manages live booking state and synchronizes multi-tab storage events across components.
