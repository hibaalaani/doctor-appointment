import React from "react";
import { useHistory } from "react-router-dom";

const NEXT_SLOTS = ["09:00", "10:30", "14:00", "15:30"];

function DoctorCard({ doctor }) {
  const history = useHistory();
  const initials = doctor.name
    .replace("Dr.", "")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  

  const nextSlot = doctor.accepting ? NEXT_SLOTS[doctor.id % NEXT_SLOTS.length] : null;

  return (
    <div
      className="doctor-card"
      onClick={() => history.push(`/doctors/${doctor.id}`)}
    >
      {/* Avatar */}
      <div className="doctor-avatar">{initials}</div>

      {/* Info */}
      <div className="doctor-info">
        <div className="doctor-name">{doctor.name}</div>
        <div className="doctor-specialty">{doctor.specialty}</div>
        <div className="doctor-meta">
          {doctor.city && (
            <span>📍 {doctor.city}{doctor.state ? `, ${doctor.state}` : ""}</span>
          )}
          {doctor.experience > 0 && (
            <span>🏅 {doctor.experience} yrs exp</span>
          )}
          {doctor.languages && (
            <span>🌐 {doctor.languages.split(",")[0].trim()}</span>
          )}
        </div>
        {!doctor.accepting && (
          <span className="not-accepting">Not accepting patients</span>
        )}
      </div>

      {/* Action */}
      <div className="doctor-action">
        {nextSlot ? (
          <>
            <div className="next-slot-label">Next available</div>
            <div className="next-slot-time">Today · {nextSlot}</div>
            <button className="btn-book">Book</button>
          </>
        ) : (
          <button
            className="btn-book"
            style={{ background: "var(--muted)", cursor: "default" }}
          >
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}

export default DoctorCard;
