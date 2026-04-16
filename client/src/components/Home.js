import React from "react";
import { useHistory, Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const SPECIALTIES = [
  { icon: "🔬", name: "Dermatologist" },
  { icon: "🧠", name: "Neurologist" },
  { icon: "🌸", name: "Gynecologist" },
  { icon: "❤️", name: "Cardiologist" },
  { icon: "👶", name: "Pediatrician" },
  { icon: "🧘", name: "Psychiatrist" },
  { icon: "🦴", name: "Orthopedist" },
  { icon: "👁️", name: "Ophthalmologist" },
  { icon: "🩺", name: "General Practitioner" },
];

const HOW_IT_WORKS = [
  { num: "1", title: "Search", desc: "Find doctors by specialty, city, or name." },
  { num: "2", title: "Choose a slot", desc: "Pick a convenient date and time from available slots." },
  { num: "3", title: "Confirmed", desc: "Receive instant confirmation and track your appointments." },
];

function Home() {
  const history = useHistory();
  const isLoggedIn = !!localStorage.getItem("userToken");

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">Trusted by 10,000+ patients</div>
        <h1 className="hero-title">
          Find the right doctor,<br />
          <em>book in seconds</em>
        </h1>
        <p className="hero-sub">
          Real doctor profiles, live availability, instant appointments.
        </p>
        <SearchBar />
        {!isLoggedIn && (
          <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", opacity: 0.7 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#93c5fd", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        )}
      </section>

      {/* ── Specialties ── */}
      <section className="specialties-section">
        <div className="page-wrap">
          <div className="section-heading">Browse by specialty</div>
          <div className="section-sub">Choose a specialty to find available doctors near you</div>
          <div className="specialties-grid">
            {SPECIALTIES.map((s) => (
              <button
                key={s.name}
                className="specialty-chip"
                onClick={() => history.push(`/doctors?specialty=${encodeURIComponent(s.name)}`)}
              >
                <span className="specialty-icon">{s.icon}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="page-wrap">
          <div className="section-heading">How AppointmentPro works</div>
          <div className="section-sub">Book your appointment in 3 simple steps</div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.num} className="how-card">
                <div className="how-num">{step.num}</div>
                <div className="how-title">{step.title}</div>
                <div className="how-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
