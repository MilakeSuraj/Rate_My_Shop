import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

// Add keyframes for a simple fade-in animation (same as Register)
const fadeInKeyframes = `
@keyframes simpleFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(true);

  // Hide success message after 3 seconds and close modal
  useEffect(() => {
    if (pwdMsg) {
      const timer = setTimeout(() => {
        setPwdMsg("");
        setShowPwdModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pwdMsg]);

  // Inject animation keyframes into the page (same as Register)
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fadeInKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdErr("New passwords do not match");
      return;
    }
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 8) {
      setPwdErr("Password must be at least 8 characters");
      return;
    }
    setPwdLoading(true);
    try {
      const res = await API.patch("/users/password", {
        userId: user.id,
        password: pwdForm.newPassword,
      });
      if (res.data && res.data.success) {
        setPwdMsg(res.data.message || "Password updated successfully!");
        setPwdForm({ newPassword: "", confirmPassword: "" });
        // Modal will close after 3 seconds via useEffect
      } else {
        setPwdErr(res.data?.message || "Failed to update password");
      }
    } catch (err) {
      setPwdErr(err.response?.data?.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background:
          "radial-gradient(circle at 60% 40%, #3d3356 0%, #232135 100%)",
        boxShadow:
          "0 16px 48px 0 rgba(67,206,162,0.16), 0 2px 8px 0 rgba(67,206,162,0.10)",
        width: "100vw", // changed from 98vw
        minHeight: 70,
        padding: "0.5rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
        // margin: "0.7rem auto 1.2rem auto", // removed
        animation: "simpleFadeIn 0.8s cubic-bezier(.4,1.4,.6,1) both",
        fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
        // maxWidth: 900, // removed
        overflow: "visible",
      }}
    >
      <div className="container-fluid" style={{ alignItems: "center" }}>
        {/* App Logo and Name */}
        <NavLink
          to={
            user
              ? user.role === "System Administrator"
                ? "/admin/dashboard"
                : user.role === "Store Owner"
                ? "/owner"
                : "/stores"
              : "/"
          }
          className="navbar-brand d-flex align-items-center gap-2"
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: "#fff",
            letterSpacing: 1,
            textDecoration: "none",
            marginRight: 16,
            background: "transparent",
            borderRadius: "1rem",
            padding: "0.2rem 0.7rem",
            lineHeight: 1.1,
            textShadow: "0 2px 8px #00000022",
          }}
        >
          <img
            src="/assets/images/shoplogo.png"
            alt="App Logo"
            style={{
              width: 44,
              height: 44,
              objectFit: "contain",
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(67,206,162,0.13)",
              background: "#fff",
              border: "2px solid #fff",
            }}
          />
          <span style={{ color: "#b39af7" }}>
            Rate <span style={{ color: "#fff" }}>my store</span>
          </span>
        </NavLink>
        {/* Navbar toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={!navCollapsed}
          aria-label="Toggle navigation"
          onClick={() => setNavCollapsed(!navCollapsed)}
          style={{
            border: "none",
            background: "#251f38",
            borderRadius: "0.7rem",
            color: "#fff",
            boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse justify-content-end ${
            navCollapsed ? "" : "show"
          }`}
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center gap-lg-2 gap-1 ms-auto">
            {/* Remove Admin Dashboard, Owner Dashboard, Stores links */}
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    style={{
                      fontWeight: 700,
                      color: "#b39af7",
                      borderRadius: "0.8rem",
                      padding: "0.4rem 1.1rem",
                      fontSize: 15,
                      background: "#251f38",
                      marginRight: 4,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => setNavCollapsed(true)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/register"
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      borderRadius: "0.8rem",
                      padding: "0.4rem 1.1rem",
                      fontSize: 15,
                      background:
                        "linear-gradient(135deg, #b39af7 0%, #7f5af0 100%)",
                      marginRight: 4,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => setNavCollapsed(true)}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <span
                    className="badge bg-light text-dark px-3 py-2"
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: 8,
                      boxShadow: "0 1px 4px rgba(67,206,162,0.04)",
                      background: "#fff",
                      color: "#232946",
                    }}
                  >
                    {user.name}{" "}
                    <span style={{ color: "#bcb8d2", fontWeight: 400 }}>
                      ({user.role})
                    </span>
                  </span>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    className="btn"
                    type="button"
                    style={{
                      borderRadius: "0.8rem",
                      fontWeight: 700,
                      color: "#b39af7",
                      background: "#251f38",
                      border: "none",
                      fontSize: 15,
                      padding: "0.4rem 1.1rem",
                      marginRight: 4,
                      boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => {
                      setShowPwdModal(true);
                      setNavCollapsed(true);
                    }}
                  >
                    Change Password
                  </button>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    className="btn"
                    type="button"
                    style={{
                      borderRadius: "0.8rem",
                      fontWeight: 700,
                      color: "#fff",
                      background:
                        "linear-gradient(135deg, #ff5858 0%, #b39af7 100%)",
                      border: "none",
                      fontSize: 15,
                      padding: "0.4rem 1.1rem",
                      boxShadow: "0 1px 4px 0 rgba(67,206,162,0.06)",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      {/* Change Password Modal */}
      {showPwdModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            background: "rgba(44, 62, 80, 0.25)",
            backdropFilter: "blur(4px)",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1050,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "simpleFadeIn 0.7s both",
          }}
          onClick={() => setShowPwdModal(false)}
        >
          <div
            className="modal-dialog"
            style={{
              maxWidth: 420,
              width: "95%",
              margin: "0 auto",
              borderRadius: "2rem",
              boxShadow:
                "0 16px 48px 0 rgba(67,206,162,0.16), 0 2px 8px 0 rgba(67,206,162,0.10)",
              background: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "2rem",
                boxShadow: "0 4px 32px 0 rgba(67,206,162,0.13)",
                border: "none",
                background: "linear-gradient(135deg, #2d2540 0%, #232135 100%)",
                padding: "0.5rem 0.5rem 1.5rem 0.5rem",
                position: "relative",
                color: "#fff",
              }}
            >
              <form onSubmit={handlePwdSubmit}>
                <div
                  className="modal-header"
                  style={{
                    border: "none",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem",
                    background:
                      "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                    color: "#fff",
                    padding: "1.2rem 2rem 1rem 2rem",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <h5
                    className="modal-title"
                    style={{
                      fontWeight: 900,
                      fontSize: "2rem",
                      letterSpacing: "0.07em",
                      width: "100%",
                    }}
                  >
                    Change Password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    style={{
                      filter: "invert(1) grayscale(1)",
                      opacity: 0.7,
                      marginLeft: 10,
                    }}
                    onClick={() => setShowPwdModal(false)}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{
                    padding: "1.5rem 2rem 0.5rem 2rem",
                  }}
                >
                  {pwdMsg && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
                      style={{
                        borderRadius: "1.2rem",
                        fontWeight: 600,
                        fontSize: 16,
                        marginBottom: 12,
                      }}
                    >
                      {pwdMsg}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => {
                          setPwdMsg("");
                          setShowPwdModal(false);
                        }}
                        style={{ float: "right" }}
                      ></button>
                    </div>
                  )}
                  {pwdErr && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                      style={{
                        borderRadius: "1.2rem",
                        fontWeight: 600,
                        fontSize: 16,
                        marginBottom: 12,
                      }}
                    >
                      {pwdErr}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => setPwdErr("")}
                        style={{ float: "right" }}
                      ></button>
                    </div>
                  )}
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: 700, color: "#bcb8d2" }}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={pwdForm.newPassword}
                      onChange={handlePwdChange}
                      required
                      minLength={8}
                      maxLength={16}
                      style={{
                        borderRadius: "1.2rem",
                        border: "1.5px solid #4d426e",
                        fontSize: 16,
                        padding: "0.7rem 1.2rem",
                        background: "#251f38",
                        color: "#fff",
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontWeight: 700, color: "#bcb8d2" }}
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={pwdForm.confirmPassword}
                      onChange={handlePwdChange}
                      required
                      minLength={8}
                      maxLength={16}
                      style={{
                        borderRadius: "1.2rem",
                        border: "1.5px solid #4d426e",
                        fontSize: 16,
                        padding: "0.7rem 1.2rem",
                        background: "#251f38",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>
                <div
                  className="modal-footer"
                  style={{
                    border: "none",
                    padding: "1.2rem 2rem 1.5rem 2rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="btn"
                    type="button"
                    style={{
                      background: "#e4e5e9",
                      color: "#232946",
                      fontWeight: 700,
                      fontSize: 17,
                      borderRadius: "1.5rem",
                      padding: "0.7rem 2.2rem",
                      marginRight: 12,
                      border: "none",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onClick={() => setShowPwdModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn"
                    type="submit"
                    disabled={pwdLoading}
                    style={{
                      background:
                        "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: "1.5rem",
                      padding: "0.7rem 2.5rem",
                      boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                      border: "none",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {pwdLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
