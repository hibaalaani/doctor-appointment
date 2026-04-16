import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { getMyAppointments, cancelAppointment } from "../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr, timeStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  const date = new Date(y, m - 1, d);
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return {
    day:  `${days[date.getDay()]}, ${MONTHS[m-1]} ${d}, ${y}`,
    time: `${h12}:${String(min).padStart(2,"0")} ${ampm}`,
  };
}

function MyBookings() {
  const history = useHistory();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      history.push("/login");
      return;
    }
    getMyAppointments()
      .then(setAppointments)
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, [history]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || "Could not cancel");
    }
  };

  return (
    <div className="page-wrap">
      <h2 className="page-title">My Appointments</h2>
      <p className="page-subtitle">Manage your upcoming and past appointments</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading…</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No appointments yet</div>
          <div className="empty-sub">Find a doctor and book your first appointment</div>
          <Link to="/doctors" className="btn btn-primary mt-3">
            Browse Doctors
          </Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {appointments.map((appt) => {
            const fmt = formatDate(
              appt.date,
              typeof appt.slot_time === "string" ? appt.slot_time : `${appt.slot_time}`
            );
            return (
              <div key={appt.id} className="booking-card">
                <div>
                  <div className="booking-doc-name">{appt.doctor?.name}</div>
                  <div className="booking-detail">
                    🔬 {appt.doctor?.specialty}
                  </div>
                  <div className="booking-detail">
                    📍 {appt.doctor?.city}{appt.doctor?.state ? `, ${appt.doctor.state}` : ""}
                  </div>
                  <div className="booking-detail" style={{ marginTop: "0.4rem" }}>
                    📅 {fmt.day}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
                  <div className="booking-time-chip">{fmt.time}</div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => cancel(appt.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
