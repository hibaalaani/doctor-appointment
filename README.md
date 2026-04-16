# AppointmentPro

A full-stack doctor appointment booking web app. Patients can search doctors by specialty and city, view real availability, and book 30-minute appointments instantly.

---

## What Was Built

### Backend — Python / FastAPI + SQLite (or PostgreSQL)

A REST API built with **FastAPI** and **SQLAlchemy**, using **SQLite** for local development (zero-install) and switchable to PostgreSQL for production.

| Feature | Details |
|---|---|
| Auth | JWT tokens (HS256), bcrypt password hashing |
| Doctors | Full listing, filter by specialty / city / gender |
| Smart slots | 30-min slots 9am–5pm Mon–Fri, weekends excluded, booked slots hidden |
| NPI Registry | Live proxy to the US National Provider Identifier database — import real US doctors |
| Booking | Double-booking prevented at the database level (unique constraint) |
| Cancel | Patients can only cancel their own appointments |

**API Endpoints**

```
POST   /auth/register          Register a patient account
POST   /auth/login             Log in and get a JWT

GET    /doctors                List doctors (specialty, city, gender, accepting filters)
GET    /doctors/{id}           Get a single doctor's profile
GET    /doctors/{id}/slots     Available 30-min slots for a date (requires login)

POST   /appointments           Book an appointment (requires login)
GET    /appointments/mine      Your upcoming appointments (requires login)
DELETE /appointments/{id}      Cancel an appointment (requires login)

GET    /npi/search             Search real US doctors from the NPI Registry
                               Add ?seed=true to save them to your database
GET    /health                 Health check
```

Interactive API docs (Swagger UI): `http://localhost:8000/docs`

---

### Frontend — React


| Page | Path | What it does |
|---|---|---|
| Home | `/` | Hero search bar, specialty chips, how-it-works section |
| Doctor Search | `/doctors` | Filter sidebar + doctor cards with next available slot |
| Doctor Profile | `/doctors/:id` | Full bio + 5-day slot picker + instant booking |
| My Appointments | `/my-appointments` | List and cancel your bookings |
| Sign Up | `/signup` | Patient registration |
| Login | `/login` | Patient login |

---

### NPI Registry Integration

The NPI Registry is a free US government database of licensed doctors. Pull real doctor profiles into the app with one request:

```bash
# Search only — don't save:
GET /npi/search?specialty=Dermatology&city=New+York

# Search AND save to database:
GET /npi/search?specialty=Cardiology&city=Chicago&seed=true
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.9+, FastAPI, SQLAlchemy 2.0 |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | python-jose (JWT HS256), passlib/bcrypt |
| Frontend | React 17, React Router 5, Bootstrap 5, Axios |
| Styling | Custom CSS design system  |

---

## Project Structure

```
appointmentpro/
├── api/                        ← Python FastAPI backend
│   ├── main.py                 ← App entry point, CORS, router registration
│   ├── database.py             ← SQLAlchemy engine (SQLite default)
│   ├── models.py               ← User, Doctor, Appointment ORM tables
│   ├── schemas.py              ← Pydantic v2 request/response models
│   ├── auth.py                 ← JWT + bcrypt utilities
│   ├── seed.py                 ← 10 sample doctors for local dev
│   ├── requirements.txt
│   ├── .env.example
│   └── routers/
│       ├── auth.py             ← /auth/register, /auth/login
│       ├── doctors.py          ← /doctors, /doctors/{id}/slots
│       ├── appointments.py     ← /appointments
│       └── npi.py              ← /npi/search
│
└── client/                     ← React frontend
    └── src/
        ├── App.js              ← Routes
        ├── App.css             ← Full design system
        ├── services/api.js     ← All API calls (axios)
        ├── components/
        │   ├── Home.js         ← Landing page
        │   ├── AllClinics.js   ← Doctor search + filter
        │   ├── DoctorCard.js   ← Search result card
        │   ├── FilterSidebar.js← Specialty / city / gender filters
        │   ├── SearchBar.js    ← Hero search input
        │   └── SlotPicker.js   ← Calendar + time slot booking
        └── pages/
            ├── DoctorProfile.js← Doctor detail + booking
            ├── MyBookings.js   ← Patient appointment list
            ├── Login.js
            ├── SignUp.js
            └── Navbar.js
```

---

## How to Run Locally

### Prerequisites
- Python 3.9 or newer
- Node.js 16 or newer
- No database installation needed — SQLite is built into Python

### 1. Set up the backend

```bash
cd api

# Install greenlet pre-built wheel first (required on Python 3.9 / Windows)
pip install "greenlet==3.1.1" --only-binary :all:

# Install all dependencies
pip install -r requirements.txt

# Seed the database with 10 sample doctors
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

API running at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### 2. Start the frontend

```bash
cd client
npm install    # first time only
npm start
```

App opens at: `http://localhost:3000`

### 3. (Optional) Import real US doctors from NPI Registry

With the API running, visit this URL in your browser to pull and save real doctors:

```
http://localhost:8000/npi/search?specialty=Dermatology&city=New+York&seed=true
```

Or use the interactive Swagger UI at `http://localhost:8000/docs`.

---

## Switching to PostgreSQL (Production)

SQLite is perfect for development. For production:

1. Copy `api/.env.example` to `api/.env` and fill in:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/appointmentpro
SECRET_KEY=your-long-random-secret-key
```

2. Uncomment `psycopg2-binary` in `requirements.txt`, then reinstall:

```bash
pip install -r requirements.txt
```

The app auto-creates all tables on first run.

---

## Future Improvements

### Near-term
- [ ] **Email confirmations** — send booking/cancellation emails via SendGrid or Resend
- [ ] **Doctor self-registration** — clinic/doctor sign-up flow with admin approval
- [ ] **Reviews & ratings** — patients leave star ratings after appointments
- [ ] **Appointment reasons** — patients add a note/reason when booking

### Features
- [ ] **Map integration** — show doctors on a map (Google Maps / Leaflet.js)
- [ ] **Search by distance** — sort results by proximity to user location
- [ ] **Recurring availability** — doctors set weekly schedules instead of per-day slots
- [ ] **Video consultation** — online appointment option (e.g. Daily.co / Whereby)
- [ ] **SMS reminders** — Twilio notifications 24h before appointment
- [ ] **Payment integration** — Stripe for consultation fee collection
- [ ] **Multi-language** — Arabic, French, Spanish support

### Technical
- [ ] **Alembic migrations** — proper schema migration system for production deploys
- [ ] **Admin dashboard** — manage doctors, users, and all bookings
- [ ] **More specialties** — expand beyond 9 using full NPI taxonomy codes
- [ ] **Search autocomplete** — live doctor name suggestions as you type
- [ ] **Mobile app** — React Native app sharing the same FastAPI backend
- [ ] **Docker Compose** — containerized deployment (Nginx + API + PostgreSQL)
- [ ] **Upgrade to React 18** — concurrent rendering, better performance

---

## Author

Built by **hiba alaani** — started 2022 as a MERN stack prototype, fully rebuilt Oktoper  2025 with Python/FastAPI + SQLite/PostgreSQL .
