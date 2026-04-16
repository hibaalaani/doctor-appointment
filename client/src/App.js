import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import NavbarNav     from "./pages/Navbar";
import Home          from "./components/Home";
import DoctorSearch  from "./components/AllClinics";
import DoctorProfile from "./pages/DoctorProfile";
import Login         from "./pages/Login";
import SignUp        from "./pages/SignUp";
import MyBookings    from "./pages/MyBookings";

function App() {
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
