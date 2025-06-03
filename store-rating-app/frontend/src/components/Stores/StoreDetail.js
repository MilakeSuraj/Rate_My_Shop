import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h3 className="card-title">{store.name}</h3>
          {store.image && (
            <div className="mb-3 text-center">
              <img
                src={store.image}
                alt="Store"
                style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover" }}
              />
            </div>
          )}
          <p>
            <strong>Address:</strong> {store.address}
          </p>
          <p className="d-flex align-items-center" style={{ minHeight: 32 }}>
            <strong style={{ marginRight: 6 }}> Rating:</strong>
            <StarRating value={parseFloat(store.averageRating ?? 0)} />
          </p>
          {msg && (
            <div
              className="alert alert-success alert-dismissible fade show"
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
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Rating</label>
              <select
                className="form-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={!user}
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {yourRating && (
                <div className="form-text">
                  Your previous rating: <b>{yourRating}</b>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={!user}
            >
              Submit Rating
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
