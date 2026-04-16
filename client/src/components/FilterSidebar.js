import React from "react";

const SPECIALTIES = [
  "", "Dermatologist", "Neurologist", "Gynecologist",
  "Cardiologist", "Pediatrician", "Psychiatrist",
  "Orthopedist", "Ophthalmologist", "General Practitioner",
];

function FilterSidebar({ filters, onChange, onReset }) {
  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ ...filters, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <aside className="filter-panel">
      <div className="filter-title">Filters</div>

      <div className="filter-group">
        <label className="filter-label">Specialty</label>
        <select
          className="filter-select"
          name="specialty"
          value={filters.specialty}
          onChange={handle}
        >
          <option value="">All specialties</option>
          {SPECIALTIES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">City</label>
        <input
          className="filter-input"
          type="text"
          name="city"
          placeholder="e.g. New York"
          value={filters.city}
          onChange={handle}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Gender</label>
        <select
          className="filter-select"
          name="gender"
          value={filters.gender}
          onChange={handle}
        >
          <option value="">Any</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-check">
          <input
            type="checkbox"
            name="accepting"
            checked={filters.accepting}
            onChange={handle}
          />
          Accepting new patients
        </label>
      </div>

      <button className="filter-reset" onClick={onReset}>
        Reset filters
      </button>
    </aside>
  );
}

export default FilterSidebar;
