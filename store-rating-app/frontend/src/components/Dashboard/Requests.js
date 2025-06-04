import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

// Add keyframes for fade-in and row hover animation
const fadeInKeyframes = `
@keyframes simpleFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes rowHover {
  from {
    background: #2d2540;
    box-shadow: none;
    transform: scale(1);
  }
  to {
    background: #3d3356;
    box-shadow: 0 4px 24px 0 rgba(67,206,162,0.10);
    transform: scale(1.015);
  }
}
`;

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // Inject animation keyframes into the page
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = fadeInKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/api/auth/pending-requests");
      setRequests(res.data.requests || []);
    } catch {
      setMsg("Failed to fetch requests");
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.post(`/api/auth/approve-request/${id}`);
      setMsg("User approved!");
      fetchRequests();
    } catch {
      setMsg("Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.post(`/api/auth/reject-request/${id}`);
      setMsg("User rejected!");
      fetchRequests();
    } catch {
      setMsg("Failed to reject user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 60% 40%, #3d3356 0%, #232135 100%)",
        animation: "simpleFadeIn 0.8s cubic-bezier(.4,1.4,.6,1) both",
      }}
    >
      <div
        className="container py-4"
        style={{ animation: "simpleFadeIn 1.1s 0.2s both", maxWidth: 1300 }}
      >
        {/* Back Button */}
        <div style={{ marginBottom: 18 }}>
          <button
            className="btn btn-outline-primary"
            style={{
              borderRadius: "2rem",
              fontWeight: 600,
              padding: "0.5rem 1.5rem",
              boxShadow: "0 2px 8px 0 rgba(67,206,162,0.08)",
              letterSpacing: 0.5,
            }}
            onClick={() => navigate("/admin")}
          >
            &#8592; Back
          </button>
        </div>
        {msg && (
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
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
              animation: "simpleFadeIn 0.7s both",
            }}
          >
            {msg}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setMsg("")}
            ></button>
          </div>
        )}
        {/* Modern Table Container */}
        <div
          style={{
            background: "rgba(36, 32, 54, 0.98)",
            borderRadius: "2.2rem",
            boxShadow:
              "0 16px 48px 0 rgba(67,206,162,0.13), 0 2px 8px 0 rgba(67,206,162,0.10)",
            padding: "2.2rem 1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
            animation: "simpleFadeIn 1.1s 0.3s both",
            overflowX: "auto",
          }}
        >
          <table
            className="table"
            style={{
              borderRadius: "1.5rem",
              overflow: "hidden",
              marginBottom: 0,
              background: "rgba(45,37,64,0.97)",
              boxShadow: "0 2px 12px 0 rgba(67,206,162,0.06)",
              color: "#fff",
              fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
              fontSize: 17,
              borderCollapse: "separate",
              borderSpacing: 0,
              minWidth: 900,
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)",
                }}
              >
                <th
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: "#fff",
                    border: "none",
                    padding: "1.1rem 0.7rem",
                    letterSpacing: 1,
                    textAlign: "center",
                    textShadow: "0 2px 8px #232135, 0 1px 0 #43cea2",
                    background: "transparent",
                    textTransform: "uppercase",
                    borderRight: "1.5px solid #43cea2",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: "#fff",
                    border: "none",
                    padding: "1.1rem 0.7rem",
                    letterSpacing: 1,
                    textAlign: "center",
                    textShadow: "0 2px 8px #232135, 0 1px 0 #43cea2",
                    background: "transparent",
                    textTransform: "uppercase",
                    borderRight: "1.5px solid #43cea2",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: "#fff",
                    border: "none",
                    padding: "1.1rem 0.7rem",
                    letterSpacing: 1,
                    textAlign: "center",
                    textShadow: "0 2px 8px #232135, 0 1px 0 #43cea2",
                    background: "transparent",
                    textTransform: "uppercase",
                    borderRight: "1.5px solid #43cea2",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: "#fff",
                    border: "none",
                    padding: "1.1rem 0.7rem",
                    letterSpacing: 1,
                    textAlign: "center",
                    textShadow: "0 2px 8px #232135, 0 1px 0 #43cea2",
                    background: "transparent",
                    textTransform: "uppercase",
                    borderRight: "1.5px solid #43cea2",
                  }}
                >
                  Address
                </th>
                <th
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    color: "#fff",
                    border: "none",
                    padding: "1.1rem 0.7rem",
                    letterSpacing: 1,
                    textAlign: "center",
                    textShadow: "0 2px 8px #232135, 0 1px 0 #43cea2",
                    background: "transparent",
                    textTransform: "uppercase",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4"
                    style={{
                      fontSize: 19,
                      color: "#fff",
                      background: "rgba(45,37,64,0.97)",
                      border: "none",
                      borderRadius: "0 0 1.5rem 1.5rem",
                    }}
                  >
                    No pending requests.
                  </td>
                </tr>
              ) : (
                requests.map((req, idx) => (
                  <tr
                    key={req.id}
                    style={{
                      transition:
                        "background 0.18s, box-shadow 0.18s, transform 0.18s",
                      background: hoveredRow === idx ? "#3d3356" : "#2d2540",
                      boxShadow:
                        hoveredRow === idx
                          ? "0 4px 24px 0 rgba(67,206,162,0.10)"
                          : "none",
                      animation:
                        hoveredRow === idx
                          ? "rowHover 0.3s forwards"
                          : undefined,
                      borderRadius: hoveredRow === idx ? "1.2rem" : "0",
                    }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td
                      style={{
                        verticalAlign: "middle",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {req.name}
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {req.email}
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {req.role}
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      {req.address}
                    </td>
                    <td
                      style={{ verticalAlign: "middle", textAlign: "center" }}
                    >
                      <button
                        className="btn"
                        style={{
                          fontWeight: 700,
                          borderRadius: "1.2rem",
                          minWidth: 90,
                          fontSize: 16,
                          background:
                            "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                          color: "#fff",
                          border: "none",
                          marginRight: 8,
                          boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                          transition: "transform 0.13s, box-shadow 0.13s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.09)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 16px 0 rgba(67,206,162,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px 0 rgba(67,206,162,0.10)";
                        }}
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn"
                        style={{
                          fontWeight: 700,
                          borderRadius: "1.2rem",
                          minWidth: 90,
                          fontSize: 16,
                          background:
                            "linear-gradient(90deg, #ff5858 0%, #b39af7 100%)",
                          color: "#fff",
                          border: "none",
                          boxShadow: "0 2px 8px 0 rgba(247,151,30,0.10)",
                          transition: "transform 0.13s, box-shadow 0.13s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.09)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 16px 0 rgba(247,151,30,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px 0 rgba(247,151,30,0.10)";
                        }}
                        onClick={() => handleReject(req.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
