import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      // Already logged in, redirect to dashboard
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "Store Owner") navigate("/owner");
      else navigate("/user");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/auth/login", form);
      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        login(res.data.user);
        const user = res.data.user;
        if (user.role === "Admin") {
          navigate("/admin"); // <-- change from "/admin/dashboard" to "/admin"
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
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          padding: "2.2rem 1.5rem 1.7rem 1.5rem",
          minWidth: 320,
          maxWidth: 350,
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
            Login
          </span>
        </div>
        {error && (
          <div className="alert alert-danger text-center py-2 mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
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
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <span style={{ color: "#232946", fontWeight: 600 }}>
            Don't have an account?{" "}
            <span
              style={{
                color: "#185a9d",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration: "underline",
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
