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
      if (user.role === "Admin") navigate("/admin");
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
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "2.2rem",
          boxShadow:
            "0 12px 40px 0 rgba(67,206,162,0.18), 0 2px 8px 0 rgba(67,206,162,0.10)",
          padding: "2.8rem 2.5rem 2.5rem 2.5rem",
          minWidth: 370,
          maxWidth: 480,
          width: "100%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: "2.3rem",
              letterSpacing: 1.5,
              color: "#232946",
              background: "#fff",
              textShadow: "0 4px 24px rgba(67,206,162,0.10), 0 1.5px 0 #fff",
              padding: "0.5rem 2rem",
              borderRadius: "1.5rem",
              boxShadow: "0 4px 16px 0 rgba(67,206,162,0.10)",
              border: "2px solid #e4e5e9",
              display: "inline-block",
              lineHeight: 1.1,
            }}
          >
            Register
          </span>
        </div>
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
            style={{
              fontWeight: 600,
              fontSize: 17,
              borderRadius: "1.2rem",
              boxShadow: "0 2px 8px 0 rgba(247,151,30,0.07)",
              border: "1.5px solid #ff5858",
              background: "#fff0f0",
              color: "#232946",
              paddingRight: 40,
            }}
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
            style={{
              fontWeight: 600,
              fontSize: 17,
              borderRadius: "1.2rem",
              boxShadow: "0 2px 8px 0 rgba(67,206,162,0.07)",
              border: "1.5px solid #43cea2",
              background: "#e8f7f0",
              color: "#232946",
              paddingRight: 40,
            }}
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
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="name"
              style={{
                fontWeight: 700,
                color: "#232946",
                marginBottom: 6,
                display: "block",
              }}
            >
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              style={{
                borderRadius: "1.2rem",
                padding: "0.7rem 1.1rem",
                fontSize: 16,
                border: "1.5px solid #e4e5e9",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.06)",
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="email"
              style={{
                fontWeight: 700,
                color: "#232946",
                marginBottom: 6,
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              style={{
                borderRadius: "1.2rem",
                padding: "0.7rem 1.1rem",
                fontSize: 16,
                border: "1.5px solid #e4e5e9",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.06)",
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="password"
              style={{
                fontWeight: 700,
                color: "#232946",
                marginBottom: 6,
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              style={{
                borderRadius: "1.2rem",
                padding: "0.7rem 1.1rem",
                fontSize: 16,
                border: "1.5px solid #e4e5e9",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.06)",
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="role"
              style={{
                fontWeight: 700,
                color: "#232946",
                marginBottom: 6,
                display: "block",
              }}
            >
              Role
            </label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                borderRadius: "1.2rem",
                padding: "0.7rem 1.1rem",
                fontSize: 16,
                border: "1.5px solid #e4e5e9",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.06)",
              }}
              required
            >
              <option value="Normal User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              {/* No admin option in dropdown */}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              style={{
                fontWeight: 700,
                color: "#232946",
                marginBottom: 6,
                display: "block",
              }}
            >
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              style={{
                borderRadius: "1.2rem",
                padding: "0.7rem 1.1rem",
                fontSize: 16,
                border: "1.5px solid #e4e5e9",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.06)",
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              borderRadius: "1.5rem",
              padding: "0.7rem 0",
              background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
              border: "none",
              boxShadow: "0 2px 8px 0 rgba(67,206,162,0.13)",
              letterSpacing: 1,
              marginBottom: 8,
              transition: "background 0.2s, transform 0.13s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #185a9d 0%, #43cea2 100%)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)")
            }
          >
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <span style={{ color: "#232946", fontWeight: 600 }}>
            Already have an account?{" "}
            <span
              style={{
                color: "#185a9d",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
