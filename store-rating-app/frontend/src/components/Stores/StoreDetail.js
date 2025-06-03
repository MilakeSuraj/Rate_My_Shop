import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import { useAuth } from "../../App";

// StarRating component for displaying stars
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

export default function StoreDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [rating, setRating] = useState(1);
  const [yourRating, setYourRating] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Fetch store details and user's rating
  useEffect(() => {
    const fetchStore = async () => {
      setMsg("");
      setError("");
      try {
        const res = await API.get("/api/stores");
        const found = res.data.stores.find((s) => String(s.id) === String(id));
        setStore(found);
        if (found && found.ratings && user) {
          // If backend returns all ratings, find user's rating
          const userRating = found.ratings.find((r) => r.userId === user.id);
          setYourRating(userRating ? userRating.rating : null);
          setRating(userRating ? userRating.rating : 1);
        } else {
          setYourRating(null);
          setRating(1);
        }
      } catch {
        setError("Failed to fetch store details");
      }
    };
    fetchStore();
  }, [id, user, msg]);

  // Submit or update rating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await API.post("/api/ratings", {
        rating,
        userId: user.id,
        storeId: id,
      });
      setMsg("Rating submitted!");
      setTimeout(() => navigate(-1), 1000); // Go back after 1s
    } catch {
      setError("Failed to submit rating");
    }
  };

  if (!store) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <button
        className="btn"
        style={{
          background: "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          borderRadius: "1.5rem",
          padding: "0.5rem 1.7rem",
          marginBottom: 24,
          boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
          border: "none",
          transition: "background 0.2s, color 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
        onClick={() => navigate(-1)}
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
          width="22"
          height="22"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          style={{ marginRight: 7, marginBottom: 2 }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back
      </button>
      <div
        className="card shadow mx-auto"
        style={{
          borderRadius: "1.5rem",
          boxShadow: "0 4px 24px 0 rgba(67,206,162,0.13)",
          border: "none",
          padding: 0,
        }}
      >
        <div
          className="card-body"
          style={{
            padding: "2.2rem 2.2rem 2rem 2.2rem",
            background: "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
            borderRadius: "1.5rem",
          }}
        >
          <h2
            className="card-title"
            style={{
              fontWeight: 900,
              fontSize: "2.2rem",
              letterSpacing: "0.04em",
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            {store.name}
          </h2>
          {store.image && (
            <div className="mb-4 text-center">
              <img
                src={store.image}
                alt="Store"
                style={{
                  maxWidth: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 12px 0 rgba(67,206,162,0.10)",
                }}
              />
            </div>
          )}
          <p style={{ fontSize: 18, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: "#232946" }}>Address:</span>{" "}
            {store.address}
          </p>
          <div
            className="d-flex align-items-center mb-4"
            style={{
              minHeight: 36,
              fontSize: 18,
              fontWeight: 700,
              color: "#232946",
              gap: 8,
            }}
          >
            <span>Rating:</span>
            <StarRating value={parseFloat(store.averageRating ?? 0)} />
            <span style={{ fontWeight: 500, color: "#888", fontSize: 16 }}>
              ({store.averageRating ?? "N/A"})
            </span>
          </div>
          {msg && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
              style={{
                fontWeight: 600,
                fontSize: 17,
                borderRadius: "1.2rem",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.07)",
                border: "1.5px solid #43cea2",
                background: "#e8f7f0",
                color: "#232946",
                paddingRight: 40,
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
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
              style={{
                fontWeight: 600,
                fontSize: 17,
                borderRadius: "1.2rem",
                boxShadow: "0 2px 8px 0 rgba(247,151,30,0.07)",
                border: "1.5px solid #ff5858",
                background: "#fff0f0",
                color: "#232946",
                paddingRight: 40,
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
          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <div className="mb-3">
              <label
                className="form-label"
                style={{ fontWeight: 700, fontSize: 17 }}
              >
                Your Rating
              </label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={!user}
                style={{
                  borderRadius: "1.2rem",
                  border: "1.5px solid #e4e5e9",
                  fontSize: 16,
                  padding: "0.7rem 1.2rem",
                }}
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {yourRating && (
                <div className="form-text" style={{ fontWeight: 600 }}>
                  Your previous rating: <b>{yourRating}</b>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!user}
              style={{
                background: "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                borderRadius: "1.5rem",
                padding: "0.7rem 2.5rem",
                boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                border: "none",
                transition: "background 0.2s, color 0.2s",
                width: "100%",
                marginTop: 8,
              }}
            >
              Submit Rating
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
