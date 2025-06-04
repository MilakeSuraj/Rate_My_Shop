import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

// Add keyframes for a simple fade-in animation (same as Register)
const fadeInKeyframes = `
@keyframes simpleFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

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

  // Inject animation keyframes into the page
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fadeInKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
        background:
          "radial-gradient(circle at 60% 40%, #3d3356 0%, #232135 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        padding: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "rgba(36, 32, 54, 0.98)",
          borderRadius: "1.5rem",
          boxShadow:
            "0 16px 48px 0 rgba(67,206,162,0.16), 0 2px 8px 0 rgba(67,206,162,0.10)",
          overflow: "hidden",
          width: "98vw",
          maxWidth: 700,
          minHeight: 340,
          height: 440,
          alignItems: "stretch",
          animation: "simpleFadeIn 0.8s cubic-bezier(.4,1.4,.6,1) both",
        }}
      >
        {/* Left panel: single image only */}
        <div
          style={{
            flex: 1.1,
            background: "linear-gradient(135deg, #2d2540 60%, #232135 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.2rem 0.7rem 1rem 0.7rem",
            minWidth: 180,
            maxWidth: 220,
            position: "relative",
            minHeight: 340,
            height: "100%",
            boxSizing: "border-box",
            animation: "simpleFadeIn 1s both",
          }}
        >
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0.7rem 0",
              minHeight: 120,
              position: "relative",
              transition: "min-height 0.3s",
            }}
          >
            <img
              src="/assets/images/shoplogo.png"
              alt="Shop Logo"
              style={{
                width: "90%",
                borderRadius: "1.2rem",
                objectFit: "cover",
                maxHeight: 140,
                minHeight: 90,
                boxShadow: "0 6px 32px 0 rgba(67,206,162,0.13)",
                background: "#fff",
                transition: "all 0.5s cubic-bezier(.4,1.4,.6,1)",
                display: "block",
                border: "3px solid #fff",
                animation: "simpleFadeIn 1.1s 0.1s both",
              }}
            />
          </div>
        </div>
        {/* Right panel: form */}
        <div
          style={{
            flex: 2,
            background: "#2d2540",
            padding: "1.2rem 0.7rem 1rem 0.7rem",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
            animation: "simpleFadeIn 1.1s 0.2s both",
            overflow: "hidden",
            height: "100%",
          }}
        >
          <div style={{ textAlign: "left", marginBottom: 10 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: "1.15rem",
                letterSpacing: 1,
                color: "#fff",
                background: "transparent",
                padding: "0.1rem 0",
                borderRadius: "1rem",
                display: "inline-block",
                lineHeight: 1.1,
                textShadow: "0 2px 8px #00000022",
              }}
            >
              Login
            </span>
            <div
              style={{
                marginTop: 2,
                color: "#bcb8d2",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              Don't have an account?{" "}
              <span
                style={{
                  color: "#b39af7",
                  cursor: "pointer",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </div>
          </div>
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
              style={{
                fontWeight: 600,
                fontSize: 17,
                borderRadius: "1.2rem",
                border: "1.5px solid #ff5858",
                background: "#fff0f0",
                color: "#232946",
                paddingRight: 40,
                marginBottom: 18,
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
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ overflow: "hidden" }}
          >
            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="email"
                style={{
                  color: "#bcb8d2",
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                  fontSize: 11,
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
                  borderRadius: "0.6rem",
                  padding: "0.4rem 0.7rem",
                  fontSize: 12,
                  border: "1.2px solid #4d426e",
                  background: "#251f38",
                  color: "#fff",
                  width: "100%",
                  boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label
                htmlFor="password"
                style={{
                  color: "#bcb8d2",
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                  fontSize: 11,
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
                  borderRadius: "0.6rem",
                  padding: "0.4rem 0.7rem",
                  fontSize: 12,
                  border: "1.2px solid #4d426e",
                  background: "#251f38",
                  color: "#fff",
                  width: "100%",
                  boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
                }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                fontWeight: 800,
                fontSize: "0.98rem",
                borderRadius: "0.8rem",
                padding: "0.6rem 0",
                background: "linear-gradient(135deg, #b39af7 0%, #7f5af0 100%)",
                border: "none",
                color: "#fff",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.13)",
                letterSpacing: 1,
                marginBottom: 4,
                transition: "background 0.2s, transform 0.13s",
                width: "100%",
                minWidth: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #7f5af0 0%, #b39af7 100%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #b39af7 0%, #7f5af0 100%)")
              }
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
