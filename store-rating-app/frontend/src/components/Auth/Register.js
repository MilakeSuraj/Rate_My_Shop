import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "Normal User",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Already logged in, redirect to dashboard
      if (user.role === "System Administrator") navigate("/admin");
      else if (user.role === "Store Owner") navigate("/owner");
      else navigate("/user");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (info || error) {
      const timer = setTimeout(() => {
        setInfo("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [info, error]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      if (form.role === "Admin" || form.role === "Store Owner") {
        // Submit as pending request
        await API.post("/api/auth/register-request", form);
        setInfo("Admin will approve you soon. Please wait for approval.");
        setForm({
          name: "",
          email: "",
          address: "",
          password: "",
          role: "Normal User",
        });
      } else {
        // Normal user registration
        const res = await API.post("/api/auth/register", form);
        if (res.data.success) {
          alert("Registration successful! Please login.");
          navigate("/login");
        } else {
          setError(res.data.message || "Registration failed");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 500, width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-center">Register</h2>
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}
          {info && (
            <div
              className="alert alert-info alert-dismissible fade show"
              role="alert"
            >
              {info}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setInfo("")}
              ></button>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={60}
            />
            <div className="form-text">Min 2, Max 60 characters.</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              name="address"
              className="form-control"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              maxLength={400}
            />
            <div className="form-text">Max 400 characters.</div>
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
              minLength={8}
              maxLength={16}
            />
            <div className="form-text">
              8-16 chars, at least 1 uppercase &amp; 1 special character.
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
