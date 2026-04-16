import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getDoctors } from "../services/api";
import DoctorCard from "./DoctorCard";
import FilterSidebar from "./FilterSidebar";
import SearchBar from "./SearchBar";

const DEFAULT_FILTERS = { specialty: "", city: "", gender: "", accepting: false };

function DoctorSearch() {
  const history = useHistory();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Read initial filters from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      specialty: params.get("specialty") || "",
      city:      params.get("city") || "",
      gender:    params.get("gender") || "",
      accepting: params.get("accepting") === "true",
    });
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    setError("");
    const query = { ...filters };
    if (!query.accepting) delete query.accepting;
    getDoctors(query)
      .then(setDoctors)
      .catch((err) => {
        if (!err.response) {
          setError("Cannot reach the server. Please make sure the backend is running on port 8000.");
        } else {
          setError(`Error ${err.response.status}: ${err.response.data?.detail || "Failed to load doctors."}`);
        }
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    history.push("/doctors");
  };

  return (
    <div className="page-wrap">
      <div style={{ marginBottom: "1.5rem" }}>
        <SearchBar initialSpecialty={filters.specialty} initialCity={filters.city} />
      </div>

      <div className="search-layout">
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <div>
          {loading ? (
            <div className="loading-spinner">Loading doctors…</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No doctors found</div>
              <div className="empty-sub">Try adjusting your filters</div>
            </div>
          ) : (
            <>
              <p className="result-count">{doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found</p>
              {doctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorSearch;
