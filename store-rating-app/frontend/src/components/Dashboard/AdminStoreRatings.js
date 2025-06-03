import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function StarRating({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fill = "#e4e5e9";
    if (value >= i) fill = "#FFD700";
    else if (value >= i - 0.5) fill = "url(#half)";
    stars.push(
      <svg
        key={i}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ marginRight: 2 }}
      >
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#e4e5e9" />
          </linearGradient>
        </defs>
        <polygon
          points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36"
          fill={fill}
        />
      </svg>
    );
  }
  return <span style={{ verticalAlign: "middle" }}>{stars}</span>;
}

export default function AdminStoreRatings() {
  const [stores, setStores] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/stores/with-ratings");
        setStores(res.data.stores || []);
      } catch {
        setMsg("Failed to fetch store ratings");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="mb-4 d-flex align-items-center shadow-sm"
          style={{
            borderRadius: "2rem",
            padding: "0.7rem 1.7rem",
            fontWeight: 600,
            fontSize: 20,
            gap: 10,
            border: "none",
            background: "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
            color: "#fff",
            boxShadow: "0 2px 12px 0 rgba(67,206,162,0.13)",
            transition: "background 0.2s, box-shadow 0.2s, color 0.2s",
          }}
          onClick={() => navigate("/admin")}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)")
          }
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <h2 className="mb-4 text-center">Store Ratings (All)</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      {stores.length === 0 ? (
        <div className="text-center text-muted">No stores found.</div>
      ) : (
        stores.map((store) => (
          <div key={store.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{store.name}</h5>
              <p>
                <strong>Owner:</strong> {store.owner ? store.owner.name : "N/A"}
                <br />
                <strong>Email:</strong> {store.email}
                <br />
                <strong>Address:</strong> {store.address}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                <StarRating
                  value={
                    store.ratings && store.ratings.length > 0
                      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                        store.ratings.length
                      : 0
                  }
                />
                <span style={{ marginLeft: 8 }}>
                  ({store.ratings ? store.ratings.length : 0} ratings)
                </span>
              </p>
              <div>
                <h6>Ratings:</h6>
                {!store.ratings || store.ratings.length === 0 ? (
                  <div className="text-muted">No ratings yet.</div>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Address</th>
                        <th>Rating</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.ratings.map((rating) => (
                        <tr key={rating.id}>
                          <td>{rating.user ? rating.user.name : "N/A"}</td>
                          <td>{rating.user ? rating.user.email : "N/A"}</td>
                          <td>{rating.user ? rating.user.role : "N/A"}</td>
                          <td>{rating.user ? rating.user.address : "N/A"}</td>
                          <td>
                            <StarRating value={rating.rating} /> (
                            {rating.rating})
                          </td>
                          <td>
                            {rating.createdAt
                              ? new Date(rating.createdAt).toLocaleString()
                              : ""}
                          </td>
                          <td>
                            {rating.updatedAt
                              ? new Date(rating.updatedAt).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
