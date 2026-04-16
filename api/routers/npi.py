"""
NPI Registry proxy + optional database seeder.

GET /npi/search?specialty=Dermatology&city=New+York&state=NY&limit=10&seed=false
"""
from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter()

NPI_BASE = "https://npiregistry.cms.hhs.gov/api/"


def _map_npi_result(r: dict) -> dict:
    """Map a single NPI API result to our Doctor schema dict."""
    basic = r.get("basic", {})
    first = basic.get("first_name", "").title()
    last  = basic.get("last_name", "").title()
    cred  = basic.get("credential", "")
    name  = f"Dr. {first} {last}" + (f", {cred}" if cred else "")

    taxonomies = r.get("taxonomies", [])
    specialty  = next(
        (t.get("desc", "") for t in taxonomies if t.get("primary")),
        taxonomies[0].get("desc", "") if taxonomies else "General Practitioner",
    )

    addresses = r.get("addresses", [])
    loc = next(
        (a for a in addresses if a.get("address_purpose") == "LOCATION"),
        addresses[0] if addresses else {},
    )

    phone_raw = loc.get("telephone_number", "")
    # NPI phones look like "212-555-1234" — keep as-is
    return {
        "name":      name,
        "specialty": specialty,
        "city":      loc.get("city", "").title(),
        "state":     loc.get("state", ""),
        "address":   loc.get("address_1", "").title(),
        "phone":     phone_raw,
        "gender":    basic.get("gender", ""),
        "npi":       r.get("number"),
        "accepting": True,
    }


@router.get("/search")
def search_npi(
    specialty: Optional[str] = Query(None, description="e.g. Dermatology"),
    city:      Optional[str] = Query(None),
    state:     Optional[str] = Query(None, description="2-letter state code"),
    name:      Optional[str] = Query(None, description="Doctor name (last name)"),
    limit:     int            = Query(10, le=50),
    seed:      bool           = Query(False, description="Save results to database"),
    db: Session = Depends(get_db),
):
    params: dict = {
        "version":          "2.1",
        "enumeration_type": "NPI-1",   # individuals only
        "limit":            str(limit),
    }
    if specialty:
        params["taxonomy_description"] = specialty
    if city:
        params["city"] = city
    if state:
        params["state"] = state
    if name:
        params["last_name"] = name

    try:
        resp = httpx.get(NPI_BASE, params=params, timeout=10)
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"NPI API error: {exc}")

    raw_results: List[dict] = resp.json().get("results", [])
    doctors = [_map_npi_result(r) for r in raw_results]

    if seed:
        saved = 0
        for d in doctors:
            npi_num = d.get("npi")
            if npi_num and db.query(models.Doctor).filter(models.Doctor.npi == npi_num).first():
                continue  # already in DB
            doc = models.Doctor(**{k: v for k, v in d.items() if k != "npi"}, npi=npi_num)
            db.add(doc)
            saved += 1
        db.commit()
        return {"seeded": saved, "doctors": doctors}

    return {"count": len(doctors), "doctors": doctors}
