from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, doctors, appointments, npi

# Create all tables on startup (use Alembic for production migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AppointmentPro API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
