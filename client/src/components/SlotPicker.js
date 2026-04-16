import React, { useState, useEffect } from "react";
import { getDoctorSlots, bookAppointment } from "../services/api";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildDays(count = 7) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
   
    d.setDate(today.getDate() + i);
    // skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    days.push(d);
  }
  // ensure at least 5 weekdays
  if (days.length < 5) return buildDays(14);
  return days.slice(0, 5);
}

function toISODate(d) {
  return d.toISOString().split("T")[0];
}

function SlotPicker({ doctorId, onBooked }) {
  const days = buildDays();
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedSlot(null);
    setSuccess(false);
    setError("");
    setSlotsError("");
    setLoading(true);
    getDoctorSlots(doctorId, toISODate(selectedDay))
      .then((data) => setSlots(data.slots))
      .catch((err) => {
        setSlots([]);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setSlotsError("Please log in again to see available slots.");
        } else {
          setSlotsError("Could not load slots. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [selectedDay, doctorId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    setError("");
    try {
      await bookAppointment(doctorId, toISODate(selectedDay), selectedSlot);
      setSuccess(true);
      if (onBooked) onBooked();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not book. Are you logged in?");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="slot-picker">
      <div className="slot-picker-title">📅 Book an Appointment</div>

      {/* Date tabs */}
      <div className="date-tabs">
        {days.map((d) => (
          <button
            key={toISODate(d)}
            className={`date-tab ${toISODate(d) === toISODate(selectedDay) ? "active" : ""}`}
            onClick={() => setSelectedDay(d)}
          >
            <div className="date-tab-day">{DAY_NAMES[d.getDay()]}</div>
            <div className="date-tab-num">{d.getDate()}</div>
            <div className="date-tab-mon">{MONTH_NAMES[d.getMonth()]}</div>
          </button>
        ))}
      </div>

      {/* Slots */}
      {loading ? (
        <div className="no-slots">Loading available slots…</div>
      ) : slotsError ? (
        <div className="alert alert-danger mt-2">{slotsError}</div>
      ) : slots.length === 0 ? (
        <div className="no-slots">No slots available on this day.</div>
      ) : (
        <div className="slots-grid">
          {slots.map((s) => (
            <button
              key={s}
              className={`slot-btn ${s === selectedSlot ? "active" : ""}`}
              onClick={() => { setSelectedSlot(s); setSuccess(false); setError(""); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Confirm booking */}
      {selectedSlot && !success && (
        <div className="booking-confirm">
          <p>
            Confirm appointment on{" "}
            <strong>
              {DAY_NAMES[selectedDay.getDay()]}, {MONTH_NAMES[selectedDay.getMonth()]} {selectedDay.getDate()}
            </strong>{" "}
            at <strong>{selectedSlot}</strong>
          </p>
          {error && <div className="alert alert-danger mb-2">{error}</div>}
          <button className="btn-book" onClick={handleBook} disabled={booking}>
            {booking ? "Booking…" : "Confirm Appointment"}
          </button>
        </div>
      )}

      {success && (
        <div className="alert alert-success mt-2">
          ✅ Appointment confirmed! Check <strong>My Appointments</strong> for details.
        </div>
      )}
    </div>
  );
}

export default SlotPicker;
