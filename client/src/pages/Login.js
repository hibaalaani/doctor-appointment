import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("userToken", data.access_token);
      history.push("/doctors");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">AppointmentPro</div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to manage your appointments</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
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
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" style={{ fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
