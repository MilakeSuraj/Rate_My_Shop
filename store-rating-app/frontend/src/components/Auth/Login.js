import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      // Already logged in, redirect to dashboard
      if (user.role === "System Administrator") navigate("/admin");
      else if (user.role === "Store Owner") navigate("/owner");
      else navigate("/user");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", form);
      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        login(res.data.user);
        const user = res.data.user;
        if (user.role === "System Administrator") {
          navigate("/admin/dashboard");
        } else if (user.role === "Store Owner") {
          navigate("/owner");
        } else {
          navigate("/stores");
        }
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Network error: Unable to reach server");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
