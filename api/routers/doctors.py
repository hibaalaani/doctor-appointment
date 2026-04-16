from datetime import date, time, timedelta, datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

import models, schemas
from auth import get_current_user
from database import get_db

router = APIRouter()

# 9:00 → 17:00, 30-min slots
SLOT_START = time(9, 0)
SLOT_END   = time(17, 0)
SLOT_STEP  = 30  # minutes

ALLOWED_SPECIALTIES = [
    "Dermatologist", "Neurologist", "Gynecologist",
    "Cardiologist", "Pediatrician", "Psychiatrist",
    "Orthopedist", "Ophthalmologist", "General Practitioner",
]


def _generate_slots(day: date, booked: set) -> List[str]:
    """Return HH:MM strings for all free 30-min slots on a weekday."""
    if day.weekday() >= 5:   # Saturday / Sunday
        return []
    now = datetime.now()
    is_today = day == now.date()
    current_time = now.time()
    slots = []
    current = SLOT_START
    while current < SLOT_END:
        slot_str = current.strftime("%H:%M")
        if slot_str not in booked and (not is_today or current > current_time):
            slots.append(slot_str)
        # advance 30 min
        dt = timedelta(hours=current.hour, minutes=current.minute + SLOT_STEP)
        total_min = int(dt.total_seconds() // 60)
        current = time(total_min // 60, total_min % 60)
    return slots


@router.get("/cities", response_model=List[str])
def list_cities(db: Session = Depends(get_db)):
    rows = db.query(models.Doctor.city).distinct().order_by(models.Doctor.city).all()
    return [r[0] for r in rows if r[0]]


@router.get("", response_model=List[schemas.DoctorOut])
def list_doctors(
    specialty: Optional[str] = Query(None),
    city:      Optional[str] = Query(None),
    gender:    Optional[str] = Query(None),
    accepting: Optional[bool] = Query(None),
    page:      int = Query(1, ge=1),
    limit:     int = Query(20, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(models.Doctor)
    if specialty:
        q = q.filter(models.Doctor.specialty.ilike(f"%{specialty}%"))
    if city:
        q = q.filter(models.Doctor.city.ilike(f"%{city}%"))
    if gender:
        q = q.filter(models.Doctor.gender == gender)
    if accepting is not None:
        q = q.filter(models.Doctor.accepting == accepting)

    return q.offset((page - 1) * limit).limit(limit).all()


@router.get("/{doctor_id:int}", response_model=schemas.DoctorOut)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.get("/{doctor_id:int}/slots", response_model=schemas.SlotsResponse)
def get_slots(
    doctor_id: int,
    date: date = Query(..., description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
    _: models.User = Depends(get_current_user),
):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    booked_times = {
        appt.slot_time.strftime("%H:%M")
        for appt in db.query(models.Appointment).filter(
            models.Appointment.doctor_id == doctor_id,
            models.Appointment.date == date,
        ).all()
    }

    return {"date": str(date), "slots": _generate_slots(date, booked_times)}
