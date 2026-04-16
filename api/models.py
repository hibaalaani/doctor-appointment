from sqlalchemy import (
    Column, Integer, String, Date, Time, ForeignKey,
    Boolean, UniqueConstraint,
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String(100), nullable=False)
    email            = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password  = Column(String(255), nullable=False)

    appointments = relationship("Appointment", back_populates="patient")


class Doctor(Base):
    __tablename__ = "doctors"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(150), nullable=False)
    specialty   = Column(String(100), nullable=False, index=True)
    city        = Column(String(100), nullable=False, index=True)
    state       = Column(String(2))
    address     = Column(String(255))
    phone       = Column(String(20))
    gender      = Column(String(10), default="")   # "M" | "F" | ""
    npi         = Column(String(10), unique=True, nullable=True)
    accepting   = Column(Boolean, default=True)
    bio         = Column(String(500), default="")
    languages   = Column(String(200), default="English")
    experience  = Column(Integer, default=0)        # years

    appointments = relationship("Appointment", back_populates="doctor")


class Appointment(Base):
    __tablename__ = "appointments"

    id         = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id  = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date       = Column(Date, nullable=False)
    slot_time  = Column(Time, nullable=False)

    patient = relationship("User", back_populates="appointments")
    doctor  = relationship("Doctor", back_populates="appointments")

    __table_args__ = (
        UniqueConstraint("doctor_id", "date", "slot_time", name="uq_doctor_slot"),
    )
