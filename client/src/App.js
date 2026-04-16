import "./App.css";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://doctor-appointment-k9kz.onrender.com";

import NavbarNav     from "./pages/Navbar";
import Home          from "./components/Home";
import DoctorSearch  from "./components/AllClinics";
import DoctorProfile from "./pages/DoctorProfile";
import Login         from "./pages/Login";
import SignUp        from "./pages/SignUp";
import MyBookings    from "./pages/MyBookings";

function App() {
  // Ping the backend on load so it wakes up from Render free-tier sleep
  useEffect(() => {
    axios.get(`${BASE_URL}/health`).catch(() => {});
  }, []);

  return (
    <Router>
      <div className="App">
        <NavbarNav />
        <main className="main-content">
          <Switch>
            <Route exact path="/"               component={Home} />
            <Route path="/doctors/:id"          component={DoctorProfile} />
            <Route path="/doctors"              component={DoctorSearch} />
            <Route path="/login"                component={Login} />
            <Route path="/signup"               component={SignUp} />
            <Route path="/my-appointments"      component={MyBookings} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
