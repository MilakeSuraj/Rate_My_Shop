import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [msg, setMsg] = useState("");
  const [hovered, setHovered] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get stores
        const storesRes = await API.get("/api/stores");
        // Get ratings count
        const ratingsRes = await API.get("/api/ratings");
        setStats({
          users: storesRes.data.count || 0,
          stores: storesRes.data.count || 0,
          ratings: ratingsRes.data.count || 0,
        });
      } catch (e) {
        setMsg("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, [msg]);

  // Fetch pending requests count
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get("/api/auth/pending-requests");
        setPendingCount(res.data.requests ? res.data.requests.length : 0);
      } catch {
        setPendingCount(0);
      }
    };
    fetchPending();
  }, []);

  return (
    <div className="container py-4">
      {/* Pending Requests Button - top right */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button
          className="btn btn-warning position-relative"
          style={{
            fontWeight: 600,
            fontSize: "1rem",
            padding: "0.45rem 1.5rem 0.45rem 1.5rem",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 8px 0 rgba(247,151,30,0.13)",
            letterSpacing: 0.5,
            minWidth: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate("/admin/requests")}
        >
          Pending Requests
          {pendingCount > 0 && (
            <span
              style={{
                background: "#e53935",
                color: "#fff",
                borderRadius: "50%",
                minWidth: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 15,
                marginLeft: 10,
                boxShadow: "0 2px 8px 0 rgba(229,57,53,0.18)",
                border: "2px solid #fff",
                position: "relative",
                top: "-2px",
              }}
            >
              {pendingCount}
            </span>
          )}
        </button>
      </div>
      <div
        className="mb-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 120,
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "3.2rem",
            letterSpacing: 2,
            color: "#232946",
            background: "#fff",
            textShadow: "0 4px 24px rgba(67,206,162,0.10), 0 1.5px 0 #fff",
            padding: "1.1rem 4rem",
            borderRadius: "2.5rem",
            boxShadow: "0 8px 32px 0 rgba(67,206,162,0.13)",
            border: "2.5px solid #e4e5e9",
            transition: "box-shadow 0.2s",
            textAlign: "center",
            lineHeight: 1.1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 420,
            minHeight: 90,
            margin: "0 auto",
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: 900,
              fontSize: "3.2rem",
              letterSpacing: "0.08em",
              color: "#232946",
              background: "none",
              display: "block",
              lineHeight: 1.1,
            }}
          >
            Admin Dashboard
          </span>
        </span>
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div
        className="d-flex flex-wrap justify-content-center align-items-center gap-5"
        style={{
          minHeight: "65vh",
          margin: "0 auto",
          maxWidth: 1400,
        }}
      >
        {/* Total Users */}
        <div
          onMouseEnter={() => setHovered(0)}
          onMouseLeave={() => setHovered(null)}
          style={{
            flex: "1 1 400px",
            minWidth: 340,
            maxWidth: 420,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="dashboard-card"
            style={{
              cursor: "pointer",
              borderRadius: "2.5rem",
              background: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)",
              color: "#fff",
              boxShadow:
                hovered === 0
                  ? "0 16px 48px 0 rgba(78,84,200,0.28)"
                  : "0 4px 18px 0 rgba(78,84,200,0.13)",
              transform:
                hovered === null
                  ? "scale(1)"
                  : hovered === 0
                  ? "scale(1.13)"
                  : "scale(0.91)",
              filter:
                hovered === null
                  ? "none"
                  : hovered === 0
                  ? "none"
                  : "blur(2.5px) grayscale(0.3) brightness(0.9)",
              opacity: hovered === null ? 1 : hovered === 0 ? 1 : 0.7,
              transition:
                "all 0.33s cubic-bezier(.4,2,.6,1), box-shadow 0.2s, filter 0.2s",
              minWidth: 320,
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: hovered === 0 ? 2 : 1,
              padding: "2.7rem 2rem 2.2rem 2rem",
            }}
            onClick={() => navigate("/admin/users")}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "50%",
                width: 88,
                height: 88,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.09)",
              }}
            >
              {/* User Icon */}
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="5" fill="#4e54c8" />
                <path
                  d="M4 20c0-4.3137 3.134-8 8-8s8 3.6863 8 8"
                  stroke="#4e54c8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h5
              className="card-title mb-1"
              style={{ fontWeight: 800, fontSize: 28, letterSpacing: 0.7 }}
            >
              Total Users
            </h5>
            <p
              className="display-6 mb-0"
              style={{ fontWeight: 800, fontSize: 54, letterSpacing: 1.5 }}
            >
              {stats.users}
            </p>
          </div>
        </div>
        {/* Total Stores */}
        <div
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
          style={{
            flex: "1 1 400px",
            minWidth: 340,
            maxWidth: 420,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="dashboard-card"
            style={{
              cursor: "pointer",
              borderRadius: "2.5rem",
              background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              boxShadow:
                hovered === 1
                  ? "0 16px 48px 0 rgba(67,206,162,0.22)"
                  : "0 4px 18px 0 rgba(67,206,162,0.10)",
              transform:
                hovered === null
                  ? "scale(1)"
                  : hovered === 1
                  ? "scale(1.13)"
                  : "scale(0.91)",
              filter:
                hovered === null
                  ? "none"
                  : hovered === 1
                  ? "none"
                  : "blur(2.5px) grayscale(0.3) brightness(0.9)",
              opacity: hovered === null ? 1 : hovered === 1 ? 1 : 0.7,
              transition:
                "all 0.33s cubic-bezier(.4,2,.6,1), box-shadow 0.2s, filter 0.2s",
              minWidth: 320,
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: hovered === 1 ? 2 : 1,
              padding: "2.7rem 2rem 2.2rem 2rem",
            }}
            onClick={() => navigate("/admin/stores")}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "50%",
                width: 88,
                height: 88,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.09)",
              }}
            >
              {/* Store Icon */}
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="8"
                  rx="2"
                  fill="#43cea2"
                />
                <path
                  d="M2 10l2-6h16l2 6"
                  stroke="#185a9d"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  fill="none"
                />
                <rect x="9" y="14" width="6" height="4" rx="1" fill="#185a9d" />
              </svg>
            </div>
            <h5
              className="card-title mb-1"
              style={{ fontWeight: 800, fontSize: 28, letterSpacing: 0.7 }}
            >
              Total Stores
            </h5>
            <p
              className="display-6 mb-0"
              style={{ fontWeight: 800, fontSize: 54, letterSpacing: 1.5 }}
            >
              {stats.stores}
            </p>
          </div>
        </div>
        {/* Total Ratings */}
        <div
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
          style={{
            flex: "1 1 400px",
            minWidth: 340,
            maxWidth: 420,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="dashboard-card"
            style={{
              cursor: "pointer", // changed from "default"
              borderRadius: "2.5rem",
              background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
              color: "#fff",
              boxShadow:
                hovered === 2
                  ? "0 16px 48px 0 rgba(247,151,30,0.22)"
                  : "0 4px 18px 0 rgba(247,151,30,0.10)",
              transform:
                hovered === null
                  ? "scale(1)"
                  : hovered === 2
                  ? "scale(1.13)"
                  : "scale(0.91)",
              filter:
                hovered === null
                  ? "none"
                  : hovered === 2
                  ? "none"
                  : "blur(2.5px) grayscale(0.3) brightness(0.9)",
              opacity: hovered === null ? 1 : hovered === 2 ? 1 : 0.7,
              transition:
                "all 0.33s cubic-bezier(.4,2,.6,1), box-shadow 0.2s, filter 0.2s",
              minWidth: 320,
              minHeight: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: hovered === 2 ? 2 : 1,
              padding: "2.7rem 2rem 2.2rem 2rem",
            }}
            onClick={() => navigate("/admin/store-ratings")}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "50%",
                width: 88,
                height: 88,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.09)",
              }}
            >
              {/* 5 Star Icon */}
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                <polygon
                  points="12,2 15,9 22,9.3 17,14 18.8,21 12,17.3 5.2,21 7,14 2,9.3 9,9"
                  fill="#ffd200"
                  stroke="#f7971e"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h5
              className="card-title mb-1"
              style={{ fontWeight: 800, fontSize: 28, letterSpacing: 0.7 }}
            >
              Total Ratings
            </h5>
            <p
              className="display-6 mb-0"
              style={{ fontWeight: 800, fontSize: 54, letterSpacing: 1.5 }}
            >
              {stats.ratings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
