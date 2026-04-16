from datetime import date, time
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Doctors ───────────────────────────────────────────────────────────────────

class DoctorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    specialty: str
    city: str
    state: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    npi: Optional[str] = None
    accepting: bool
    bio: Optional[str] = None
    languages: Optional[str] = None
    experience: Optional[int] = None

class SlotsResponse(BaseModel):
    date: str
    slots: List[str]   # e.g. ["09:00", "09:30", ...]


# ── Appointments ──────────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    doctor_id: int
    date: date
    slot_time: str   # "HH:MM"

    @field_validator("slot_time")
    @classmethod
    def parse_slot(cls, v: str) -> str:
        # validate format
        time.fromisoformat(v)
        return v

class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date: date
    slot_time: time
    doctor: DoctorOut
