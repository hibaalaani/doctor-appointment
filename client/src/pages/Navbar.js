import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return true;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function NavbarNav() {
  const history = useHistory();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("userToken");
      const valid = isTokenValid(token);
      if (!valid && token) localStorage.removeItem("userToken");
      setLoggedIn(valid);
    };

    syncAuthState();
    window.addEventListener("auth-changed", syncAuthState);
    return () => window.removeEventListener("auth-changed", syncAuthState);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("userToken");
    window.dispatchEvent(new Event("auth-changed"));
    setLoggedIn(false);
    history.push("/");
  };

  return (
    <nav className="app-navbar">
      <Link to="/" className="brand">
        Appointment<span className="brand-dot">Pro</span>
      </Link>

      <div className="nav-links">
        <Link to="/doctors" className="nav-link-item">
          Find Doctors
        </Link>

        {loggedIn ? (
          <>
            <Link to="/my-appointments" className="nav-link-item">
              My Appointments
            </Link>
            <button className="btn-nav-outline" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link-item">
              Sign in
            </Link>
            <Link to="/signup">
              <button className="btn-nav-solid">Get started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavbarNav;
