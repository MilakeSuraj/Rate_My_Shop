import { useEffect, useState } from "react";
import API from "../../api";

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

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/api/stores");
        if (res.data && res.data.success) {
          setStores(res.data.stores);
        } else {
          setError(res.data?.message || "Failed to fetch stores");
        }
      } catch (err) {
        setError("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Store List</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-4">
          {filtered.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No stores found.
            </div>
          ) : (
            filtered.map((store) => (
              <div className="col-md-6 col-lg-4" key={store.id}>
                <div className="card h-100 shadow-sm">
                  {store.image && (
                    <img
                      src={store.image}
                      alt="Store"
                      className="card-img-top"
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        background: "#f8f9fa",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{store.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Address:</strong> {store.address}
                    </p>
                    <p
                      className="mb-2 d-flex align-items-center"
                      style={{ minHeight: 32 }}
                    >
                      <strong style={{ marginRight: 6 }}>Rating:</strong>
                      <StarRating
                        value={parseFloat(store.averageRating ?? 0)}
                      />
                    </p>
                    <div className="mt-auto">
                      <a
                        href={`/stores/${store.id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
