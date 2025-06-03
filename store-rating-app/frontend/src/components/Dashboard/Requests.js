import { useEffect, useState } from "react";
import API from "../../api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");

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
      <h2>Pending Requests</h2>
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
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No pending requests.
              </td>
            </tr>
          ) : (
            requests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td>{req.role}</td>
                <td>{req.address}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
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
  );
}
