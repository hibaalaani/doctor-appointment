import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      localStorage.setItem("userToken", data.access_token);
      history.push("/doctors");
    } catch (err) {
      if (!err.response) {
        setError("Cannot reach the server. It may be waking up — please wait 30 seconds and try again.");
      } else {
        setError(err.response.data?.detail || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">AppointmentPro</div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Book appointments with top doctors in minutes</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: "1.25rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
