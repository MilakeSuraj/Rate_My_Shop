import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

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
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        borderRadius: 0,
        width: "100%",
        minHeight: 70,
        padding: "0.5rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
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
            color: "#1a1a1a",
            letterSpacing: 1,
            textDecoration: "none",
            marginRight: 16,
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              background: "#f8f9fa",
            }}
          />
          <span style={{ color: "#0d6efd" }}>
            Rate <span style={{ color: "#212529" }}>my store</span>
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
                    style={{ fontWeight: 500 }}
                    onClick={() => setNavCollapsed(true)}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/register"
                    style={{ fontWeight: 500 }}
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
                      fontWeight: 500,
                      borderRadius: 8,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    {user.name}{" "}
                    <span style={{ color: "#888", fontWeight: 400 }}>
                      ({user.role})
                    </span>
                  </span>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    style={{
                      borderRadius: 8,
                      fontWeight: 500,
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
                    className="btn btn-danger btn-sm"
                    type="button"
                    style={{
                      borderRadius: 8,
                      fontWeight: 500,
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
          onClick={() => setShowPwdModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <form onSubmit={handlePwdSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPwdModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {pwdMsg && (
                    <div
                      className="alert alert-success alert-dismissible fade show"
                      role="alert"
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
                  <div className="mb-2">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={pwdForm.newPassword}
                      onChange={handlePwdChange}
                      required
                      minLength={8}
                      maxLength={16}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={pwdForm.confirmPassword}
                      onChange={handlePwdChange}
                      required
                      minLength={8}
                      maxLength={16}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setShowPwdModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={pwdLoading}
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
