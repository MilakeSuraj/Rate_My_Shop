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
  const [hovered, setHovered] = useState(null);

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

  // Add animation keyframes for fade-in up
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUpStore {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5" style={{ maxWidth: 1300 }}>
      <div className="mb-4 d-flex justify-content-center">
        <input
          className="form-control"
          placeholder="🔍 Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            borderRadius: "2rem",
            border: "2px solid #43cea2",
            fontSize: 18,
            padding: "0.9rem 2.2rem",
            boxShadow: "0 2px 12px 0 rgba(67,206,162,0.10)",
            maxWidth: 420,
            background: "linear-gradient(90deg, #f8fafc 0%, #e4e5e9 100%)",
            fontWeight: 600,
            color: "#232946",
            outline: "none",
            transition: "border 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #4e54c8")}
          onBlur={(e) => (e.target.style.border = "2px solid #43cea2")}
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
            filtered.map((store, idx) => (
              <div
                className="col-md-6 col-lg-4"
                key={store.id}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  transition:
                    "transform 0.25s, box-shadow 0.25s, filter 0.25s, opacity 0.25s",
                  zIndex: hovered === idx ? 2 : 1,
                  filter:
                    hovered === null
                      ? "none"
                      : hovered === idx
                      ? "none"
                      : "blur(2px) grayscale(0.3) brightness(0.9)",
                  transform:
                    hovered === null
                      ? "scale(1)"
                      : hovered === idx
                      ? "scale(1.04) translateY(-6px)"
                      : "scale(0.97)",
                  opacity: hovered === null ? 1 : hovered === idx ? 1 : 0.7,
                  animation: `fadeInUpStore 0.7s cubic-bezier(.4,1.4,.6,1) both`,
                  animationDelay: `${idx * 0.13 + 0.1}s`,
                }}
              >
                <div
                  className="card h-100 shadow-sm store-card-hover"
                  style={{
                    borderRadius: "1.5rem",
                    boxShadow: "0 4px 24px 0 rgba(67,206,162,0.13)",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                >
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
                        borderTopLeftRadius: "1.5rem",
                        borderTopRightRadius: "1.5rem",
                      }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5
                      className="card-title"
                      style={{
                        fontWeight: 800,
                        fontSize: 22,
                        color: "#232946",
                        marginBottom: 10,
                      }}
                    >
                      {store.name}
                    </h5>
                    <p className="card-text mb-1" style={{ fontSize: 16 }}>
                      <strong>Address:</strong> {store.address}
                    </p>
                    <p
                      className="mb-2 d-flex align-items-center"
                      style={{ minHeight: 32, fontSize: 16 }}
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
                        style={{
                          borderRadius: "1.2rem",
                          fontWeight: 700,
                          fontSize: 17,
                          border: "1.5px solid #4e54c8",
                          color: "#4e54c8",
                          background: "#f8fafc",
                          transition: "background 0.2s, color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.color = "#4e54c8";
                        }}
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
      <style>
        {`
          .store-card-hover:hover {
            transform: scale(1.04) translateY(-6px);
            box-shadow: 0 8px 32px 0 rgba(67,206,162,0.18);
            z-index: 2;
          }
          .form-control:focus {
            box-shadow: 0 2px 12px 0 rgba(78,84,200,0.13);
            border: 2px solid #4e54c8;
          }
        `}
      </style>
    </div>
  );
}
