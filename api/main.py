import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
from routers import auth, doctors, appointments, npi
import models


def _auto_seed():
    """Seed sample doctors if the table is empty."""
    from seed import SAMPLE_DOCTORS
    db = SessionLocal()
    try:
        if db.query(models.Doctor).count() == 0:
            for data in SAMPLE_DOCTORS:
                db.add(models.Doctor(**data))
            db.commit()
            print(f"Auto-seeded {len(SAMPLE_DOCTORS)} doctors.")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables then seed on every cold start
    Base.metadata.create_all(bind=engine)
    _auto_seed()
    yield


app = FastAPI(title="AppointmentPro API", version="2.0.0", lifespan=lifespan)

# Allow localhost in dev + any Render frontend URL set via env var
_extra = os.getenv("ALLOWED_ORIGIN", "")
allowed_origins = ["http://localhost:3000"] + ([_extra] if _extra else [])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# here we define the routers endpoint
app.include_router(auth.router,         prefix="/auth",         tags=["Auth"])
app.include_router(doctors.router,      prefix="/doctors",      tags=["Doctors"])
app.include_router(appointments.router, prefix="/appointments", tags=["Appointments"])
app.include_router(npi.router,          prefix="/npi",          tags=["NPI"])


@app.get("/health")
def health():
    return {"status": "ok"}
