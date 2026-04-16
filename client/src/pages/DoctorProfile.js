import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { getDoctor } from "../services/api";
import SlotPicker from "../components/SlotPicker";

function DoctorProfile() {
  const { id } = useParams();
  const history = useHistory();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("userToken");

  useEffect(() => {
    getDoctor(id)
      .then(setDoctor)
      .catch(() => setDoctor(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-spinner">Loading…</div>;
  if (!doctor)  return (
    <div className="page-wrap">
      <div className="alert alert-danger">Doctor not found.</div>
    </div>
  );

  const initials = doctor.name
    .replace("Dr.", "")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="page-wrap">
      <button
        style={{ background: "none", border: "none", color: "var(--blue)", fontWeight: 600, cursor: "pointer", marginBottom: "1.25rem" }}
        onClick={() => history.goBack()}
      >
        ← Back to results
      </button>

      <div className="profile-layout">
        {/* Left: Doctor info */}
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name">{doctor.name}</div>
          <div className="doctor-specialty" style={{ marginBottom: "0.75rem" }}>
            {doctor.specialty}
          </div>

          {doctor.city && (
            <div className="profile-detail">📍 {doctor.city}{doctor.state ? `, ${doctor.state}` : ""}</div>
          )}
          {doctor.address && (
            <div className="profile-detail">🏥 {doctor.address}</div>
          )}
          {doctor.phone && (
            <div className="profile-detail">📞 {doctor.phone}</div>
          )}
          {doctor.experience > 0 && (
            <div className="profile-detail">🏅 {doctor.experience} years of experience</div>
          )}
          {doctor.languages && (
            <div className="profile-detail">🌐 {doctor.languages}</div>
          )}
          {!doctor.accepting && (
            <div className="not-accepting mt-2">Not accepting new patients</div>
          )}

          {doctor.bio && (
            <div className="profile-bio">{doctor.bio}</div>
          )}

          {doctor.npi && (
            <div style={{ marginTop: "1rem" }}>
              <div className="profile-tags">
                <span className="profile-tag">NPI: {doctor.npi}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Slot picker */}
        <div>
          {!isLoggedIn ? (
            <div className="slot-picker">
              <div className="slot-picker-title">📅 Book an Appointment</div>
              <div className="alert alert-warning mt-3">
                Please <Link to="/login">log in</Link> or{" "}
                <Link to="/signup">create an account</Link> to book an appointment.
              </div>
            </div>
          ) : !doctor.accepting ? (
            <div className="slot-picker">
              <div className="slot-picker-title">📅 Book an Appointment</div>
              <div className="no-slots">
                This doctor is not currently accepting new patients.
              </div>
            </div>
          ) : (
            <SlotPicker
              doctorId={doctor.id}
              onBooked={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
