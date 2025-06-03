import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");
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
    <div className="container py-4">
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
      {/* Styled Heading */}
      <div
        className="mb-4"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 80,
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "2.5rem",
            letterSpacing: 2,
            color: "#232946",
            background: "#fff",
            textShadow: "0 4px 24px rgba(67,206,162,0.10), 0 1.5px 0 #fff",
            padding: "0.7rem 3rem",
            borderRadius: "2rem",
            boxShadow: "0 8px 32px 0 rgba(67,206,162,0.13)",
            border: "2px solid #e4e5e9",
            textAlign: "center",
            lineHeight: 1.1,
            fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          Pending Requests
        </span>
      </div>
      {msg && (
        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
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
      {/* Card-like Table Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: "2rem",
          boxShadow: "0 8px 32px 0 rgba(67,206,162,0.10)",
          padding: "2.2rem 1.5rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <table
          className="table"
          style={{
            borderRadius: "1.2rem",
            overflow: "hidden",
            marginBottom: 0,
            background: "#f8fafc",
            boxShadow: "0 2px 12px 0 rgba(67,206,162,0.06)",
          }}
        >
          <thead style={{ background: "#e4e5e9" }}>
            <tr>
              <th style={{ fontWeight: 800, fontSize: 18 }}>Name</th>
              <th style={{ fontWeight: 800, fontSize: 18 }}>Email</th>
              <th style={{ fontWeight: 800, fontSize: 18 }}>Role</th>
              <th style={{ fontWeight: 800, fontSize: 18 }}>Address</th>
              <th style={{ fontWeight: 800, fontSize: 18 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4"
                  style={{ fontSize: 18 }}
                >
                  No pending requests.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr
                  key={req.id}
                  style={{
                    transition: "background 0.18s",
                    background: "#fff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f3f7fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <td style={{ verticalAlign: "middle", fontWeight: 600 }}>
                    {req.name}
                  </td>
                  <td style={{ verticalAlign: "middle" }}>{req.email}</td>
                  <td style={{ verticalAlign: "middle" }}>{req.role}</td>
                  <td style={{ verticalAlign: "middle" }}>{req.address}</td>
                  <td style={{ verticalAlign: "middle" }}>
                    <button
                      className="btn btn-success btn-sm me-2"
                      style={{
                        fontWeight: 700,
                        borderRadius: "1.2rem",
                        minWidth: 90,
                        fontSize: 16,
                        boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                        transition: "transform 0.13s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{
                        fontWeight: 700,
                        borderRadius: "1.2rem",
                        minWidth: 90,
                        fontSize: 16,
                        boxShadow: "0 2px 8px 0 rgba(247,151,30,0.10)",
                        transition: "transform 0.13s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
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
  );
}
