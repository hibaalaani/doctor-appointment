"""
Seed the database with realistic sample doctors.
I have to run it from the api/ directory: the command ++> python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

SAMPLE_DOCTORS = [
    {
        "name": "Dr. Sarah Mitchell, MD",
        "specialty": "Dermatologist",
        "city": "New York",
        "state": "NY",
        "address": "450 Park Ave",
        "phone": "212-555-0101",
        "gender": "F",
        "accepting": True,
        "bio": "Board-certified dermatologist with 12 years of experience in skin cancer detection, acne treatment, and cosmetic dermatology.",
        "languages": "English, Spanish",
        "experience": 12,
    },
    {
        "name": "Dr. James Okafor, MD",
        "specialty": "Neurologist",
        "city": "Los Angeles",
        "state": "CA",
        "address": "1200 Wilshire Blvd",
        "phone": "310-555-0202",
        "gender": "M",
        "accepting": True,
        "bio": "Specialist in headache disorders, epilepsy, and neurodegenerative diseases. Trained at Johns Hopkins.",
        "languages": "English, French",
        "experience": 9,
    },
    {
        "name": "Dr. Layla Hassan, MD",
        "specialty": "Gynecologist",
        "city": "Chicago",
        "state": "IL",
        "address": "875 N Michigan Ave",
        "phone": "312-555-0303",
        "gender": "F",
        "accepting": True,
        "bio": "Compassionate gynecologist specializing in women's health, prenatal care, and minimally invasive surgery.",
        "languages": "English, Arabic",
        "experience": 15,
    },
    {
        "name": "Dr. Robert Chen, MD",
        "specialty": "Cardiologist",
        "city": "San Francisco",
        "state": "CA",
        "address": "55 Union St",
        "phone": "415-555-0404",
        "gender": "M",
        "accepting": True,
        "bio": "Interventional cardiologist with expertise in heart failure, arrhythmias, and preventive cardiology.",
        "languages": "English, Mandarin",
        "experience": 18,
    },
    {
        "name": "Dr. Emily Torres, MD",
        "specialty": "Pediatrician",
        "city": "New York",
        "state": "NY",
        "address": "300 E 66th St",
        "phone": "212-555-0505",
        "gender": "F",
        "accepting": True,
        "bio": "Dedicated pediatrician focused on child development, immunizations, and adolescent medicine.",
        "languages": "English, Spanish",
        "experience": 7,
    },
    {
        "name": "Dr. Marcus Williams, MD",
        "specialty": "Psychiatrist",
        "city": "Boston",
        "state": "MA",
        "address": "100 Longwood Ave",
        "phone": "617-555-0606",
        "gender": "M",
        "accepting": False,
        "bio": "Child and adult psychiatrist specializing in anxiety, depression, and ADHD. Not currently accepting new patients.",
        "languages": "English",
        "experience": 11,
    },
    {
        "name": "Dr. Amira Patel, MD",
        "specialty": "Orthopedist",
        "city": "Houston",
        "state": "TX",
        "address": "6700 Main St",
        "phone": "713-555-0707",
        "gender": "F",
        "accepting": True,
        "bio": "Sports medicine and orthopedic surgeon with a focus on joint replacement and arthroscopic surgery.",
        "languages": "English, Hindi, Gujarati",
        "experience": 14,
    },
    {
        "name": "Dr. Nicolas Blanc, MD",
        "specialty": "Ophthalmologist",
        "city": "Miami",
        "state": "FL",
        "address": "1200 Brickell Ave",
        "phone": "305-555-0808",
        "gender": "M",
        "accepting": True,
        "bio": "Ophthalmologist specializing in LASIK, cataract surgery, and glaucoma management.",
        "languages": "English, French, Spanish",
        "experience": 10,
    },
    {
        "name": "Dr. Angela Kim, MD",
        "specialty": "General Practitioner",
        "city": "Seattle",
        "state": "WA",
        "address": "200 1st Ave",
        "phone": "206-555-0909",
        "gender": "F",
        "accepting": True,
        "bio": "Family medicine physician committed to preventive care, chronic disease management, and patient education.",
        "languages": "English, Korean",
        "experience": 8,
    },
    {
        "name": "Dr. David Svensson, MD",
        "specialty": "Dermatologist",
        "city": "Chicago",
        "state": "IL",
        "address": "737 N Michigan Ave",
        "phone": "312-555-1010",
        "gender": "M",
        "accepting": True,
        "bio": "Expert in eczema, psoriasis, and skin cancer with a special interest in pediatric dermatology.",
        "languages": "English, Swedish",
        "experience": 6,
    },
]


def seed():
    db = SessionLocal()
    added = 0
    for data in SAMPLE_DOCTORS:
        existing = db.query(models.Doctor).filter(models.Doctor.name == data["name"]).first()
        if not existing:
            db.add(models.Doctor(**data))
            added += 1
    db.commit()
    db.close()
    print(f"Seeded {added} doctors ({len(SAMPLE_DOCTORS) - added} already existed).")


if __name__ == "__main__":
    seed()
