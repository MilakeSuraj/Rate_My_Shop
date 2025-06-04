import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

// Add keyframes for a simple fade-in animation
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

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
    agree: false,
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
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
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    // Removed Terms & Conditions validation
    // if (!form.agree) {
    //   setError("You must agree to the Terms & Conditions.");
    //   return;
    // }
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        address: form.address,
        password: form.password,
        role: form.role,
      };
      if (form.role === "Admin" || form.role === "Store Owner") {
        await API.post("/api/auth/register-request", payload);
        setInfo("Admin will approve you soon. Please wait for approval.");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          address: "",
          password: "",
          role: "Normal User",
          agree: false,
        });
      } else {
        const res = await API.post("/api/auth/register", payload);
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

  // Inject animation keyframes into the page
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fadeInKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
              Create an account
            </span>
            <div
              style={{
                marginTop: 2,
                color: "#bcb8d2",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              Already have an account?{" "}
              <span
                style={{
                  color: "#b39af7",
                  cursor: "pointer",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/login")}
              >
                Log in
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
          {info && (
            <div
              className="alert alert-info alert-dismissible fade show"
              role="alert"
              style={{
                fontWeight: 600,
                fontSize: 17,
                borderRadius: "1.2rem",
                border: "1.5px solid #43cea2",
                background: "#e8f7f0",
                color: "#232946",
                paddingRight: 40,
                marginBottom: 18,
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
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 45%", minWidth: 0 }}>
                <label
                  htmlFor="firstName"
                  style={{
                    color: "#bcb8d2",
                    fontWeight: 500,
                    marginBottom: 1,
                    display: "block",
                    fontSize: 11, // smaller label
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
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
              <div style={{ flex: "1 1 45%", minWidth: 0 }}>
                <label
                  htmlFor="lastName"
                  style={{
                    color: "#bcb8d2",
                    fontWeight: 500,
                    marginBottom: 1,
                    display: "block",
                    fontSize: 11, // smaller label
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
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
            </div>
            <div style={{ marginBottom: 8 }}>
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
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={{
                  borderRadius: "0.6rem",
                  padding: "0.4rem 0.7rem",
                  fontSize: 12,
                  border: "1.2px solid #4d426e",
                  background: "#251f38",
                  color: "#fff",
                  boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: 8, position: "relative" }}>
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
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="role"
                style={{
                  color: "#bcb8d2",
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                  fontSize: 11,
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
              >
                <option value="Normal User">Normal User</option>
                <option value="Store Owner">Store Owner</option>
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="address"
                style={{
                  color: "#bcb8d2",
                  fontWeight: 500,
                  marginBottom: 1,
                  display: "block",
                  fontSize: 11,
                }}
              >
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                placeholder="Address"
                value={form.address}
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
            {/* Removed Terms & Conditions checkbox and button */}
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
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
