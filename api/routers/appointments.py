from datetime import time, datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models, schemas
from auth import get_current_user
from database import get_db

router = APIRouter()


@router.post("", response_model=schemas.AppointmentOut, status_code=201)
def book_appointment(
    body: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == body.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    if not doctor.accepting:
        raise HTTPException(status_code=409, detail="Doctor is not accepting new patients")

    slot = time.fromisoformat(body.slot_time)
    # Prevent booking a time slot that has already passed today.
    if body.date == datetime.now().date() and slot <= datetime.now().time():
        raise HTTPException(status_code=400, detail="Cannot book a time slot in the past")
    appt = models.Appointment(
        patient_id=current_user.id,
        doctor_id=body.doctor_id,
        date=body.date,
        slot_time=slot,
    )
    db.add(appt)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This slot is already booked")

    db.refresh(appt)
    return appt


@router.get("/mine", response_model=List[schemas.AppointmentOut])
def my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Appointment)
        .filter(models.Appointment.patient_id == current_user.id)
        .order_by(models.Appointment.date, models.Appointment.slot_time)
        .all()
    )


@router.delete("/{appointment_id}", status_code=204)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    appt = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id
    ).first()

    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your appointment")

    db.delete(appt)
    db.commit()
