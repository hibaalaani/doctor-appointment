import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getCities } from "../services/api";

const SPECIALTIES = [
  "Dermatologist", "Neurologist", "Gynecologist",
  "Cardiologist", "Pediatrician", "Psychiatrist",
  "Orthopedist", "Ophthalmologist", "General Practitioner",
];

function SearchBar({ initialSpecialty = "", initialCity = "" }) {
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [city, setCity] = useState(initialCity);
  const [cities, setCities] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getCities().then(setCities).catch(() => {});
  }, []);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set("specialty", specialty);
    if (city)      params.set("city", city);
    history.push(`/doctors?${params.toString()}`);
  };

  return (
    <form className="search-box" onSubmit={search}>
      <select
        className="search-field form-control"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      >
        <option value="">All specialties</option>
        {SPECIALTIES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input
        className="search-field form-control"
        type="text"
        placeholder="City or state…"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        list="city-suggestions"
        autoComplete="off"
      />
      {cities.length > 0 && (
        <datalist id="city-suggestions">
          {cities.map((c) => <option key={c} value={c} />)}
        </datalist>
      )}

      <button type="submit" className="search-btn">
        🔍 Search
      </button>
    </form>
  );
}

export default SearchBar;
