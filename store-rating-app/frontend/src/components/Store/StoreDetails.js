import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/api/stores/${id}`);
        if (res.data && res.data.store) {
          setStore(res.data.store);
        } else {
          setError("Store not found");
        }
      } catch {
        setError("Failed to fetch store details");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (!store) return null;

  const ratings = store.ratings || [];
  const avg =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(2)
      : "N/A";

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            {store.image && (
              <img
                src={store.image}
                alt="Store"
                className="card-img-top"
                style={{
                  width: "100%",
                  height: 300,
                  objectFit: "cover",
                  background: "#f8f9fa",
                  borderTopLeftRadius: "0.5rem",
                  borderTopRightRadius: "0.5rem",
                }}
              />
            )}
            <div className="card-body">
              <h3 className="card-title mb-3">{store.name}</h3>
              <p
                className="mb-2 d-flex align-items-center"
                style={{ minHeight: 32 }}
              >
                <span style={{ fontWeight: 600, marginRight: 6 }}>Rating:</span>
                <StarRating value={parseFloat(avg) || 0} />
              </p>
              <p>
                <strong>Email:</strong> {store.email}
              </p>
              <p>
                <strong>Address:</strong> {store.address}
              </p>
              <p>
                <strong>Owner:</strong> {store.owner ? store.owner.name : "N/A"}
              </p>
              <hr />
              <h5>Ratings & Reviews</h5>
              {ratings.length === 0 ? (
                <div className="text-muted">No ratings yet.</div>
              ) : (
                <ul className="list-group">
                  {ratings.map((r) => (
                    <li className="list-group-item" key={r.id}>
                      <StarRating value={r.rating} />{" "}
                      <span className="ms-2">{r.comment}</span>
                      <span
                        className="text-muted float-end"
                        style={{ fontSize: 13 }}
                      >
                        by {r.user?.name || "User"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
