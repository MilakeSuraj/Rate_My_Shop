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
        const res = await API.get("/api/ratings/by-store");
        setStores(res.data.stores || []);
      } catch {
        setMsg("Failed to fetch store ratings");
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="container py-4"
      style={{
        maxWidth: 1600,
        minWidth: 320,
        minHeight: 600,
        margin: "0 auto",
      }}
    >
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
      <h2
        className="mb-4 text-center"
        style={{
          fontWeight: 900,
          fontSize: "2.2rem",
          letterSpacing: "0.04em",
          color: "#232946",
        }}
      >
        Store Ratings
      </h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      {stores.length === 0 ? (
        <div className="text-center text-muted">No stores found.</div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {stores.map((store) => (
            <div
              key={store.id}
              style={{
                minWidth: 370,
                maxWidth: 420,
                flex: "0 0 370px",
                marginBottom: 32,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="card shadow-sm"
                style={{
                  borderRadius: "1.7rem",
                  boxShadow: "0 6px 32px 0 rgba(67,206,162,0.15)",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                    color: "#fff",
                    borderTopLeftRadius: "1.7rem",
                    borderTopRightRadius: "1.7rem",
                    padding: "1.5rem 2rem 1.2rem 2rem",
                  }}
                >
                  <h4
                    style={{ fontWeight: 800, marginBottom: 0, fontSize: 24 }}
                  >
                    {store.name}
                  </h4>
                  <div style={{ fontSize: 16, opacity: 0.93 }}>
                    <span style={{ fontWeight: 500 }}>Email:</span>{" "}
                    {store.email}
                  </div>
                  <div style={{ fontSize: 16, opacity: 0.93 }}>
                    <span style={{ fontWeight: 500 }}>Address:</span>{" "}
                    {store.address}
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{
                    padding: "2rem 2rem 1.3rem 2rem",
                    flex: 1,
                  }}
                >
                  <div
                    className="mb-3 d-flex align-items-center"
                    style={{ gap: 14, fontWeight: 700, fontSize: 19 }}
                  >
                    <span>Rating:</span>
                    <StarRating
                      value={
                        store.ratings && store.ratings.length > 0
                          ? store.ratings.reduce(
                              (sum, r) => sum + r.rating,
                              0
                            ) / store.ratings.length
                          : 0
                      }
                    />
                  </div>
                  <div>
                    <h6
                      style={{
                        fontWeight: 800,
                        fontSize: 17,
                        marginBottom: 14,
                      }}
                    >
                      Users:
                    </h6>
                    {!store.ratings || store.ratings.length === 0 ? (
                      <div className="text-muted">No ratings yet.</div>
                    ) : (
                      <div
                        style={{
                          borderRadius: "1.1rem",
                          background: "#f3f7fa",
                          padding: "0.7rem 0.5rem",
                          boxShadow: "0 1px 6px 0 rgba(67,206,162,0.07)",
                          maxHeight: 220,
                          overflowY: "auto",
                        }}
                      >
                        {store.ratings.map((rating) => (
                          <div
                            key={rating.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                              padding: "0.7rem 0.9rem",
                              borderRadius: "1rem",
                              marginBottom: 10,
                              background: "#fff",
                              boxShadow: "0 1px 4px 0 rgba(67,206,162,0.04)",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#232946",
                                minWidth: 90,
                                fontSize: 16,
                              }}
                            >
                              {rating.user ? rating.user.name : "N/A"}
                            </div>
                            <div
                              style={{
                                fontSize: 15,
                                color: "#555",
                                minWidth: 120,
                                wordBreak: "break-all",
                              }}
                            >
                              {rating.user ? rating.user.email : "N/A"}
                            </div>
                            <div
                              style={{
                                fontSize: 15,
                                color: "#fff",
                                background:
                                  "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)",
                                borderRadius: "1rem",
                                padding: "0.2rem 1.1rem",
                                fontWeight: 700,
                                marginRight: 8,
                                minWidth: 80,
                                textAlign: "center",
                              }}
                            >
                              {rating.user ? rating.user.role : "N/A"}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <StarRating value={rating.rating} />
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: 17,
                                  marginLeft: 2,
                                }}
                              ></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 1200px) {
            .container {
              max-width: 98vw !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
          @media (max-width: 900px) {
            .container {
              max-width: 100vw !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
          }
          @media (max-width: 600px) {
            .container {
              max-width: 100vw !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .card {
              min-width: 98vw !important;
              max-width: 99vw !important;
            }
          }
          ::-webkit-scrollbar {
            height: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: #43cea2;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
}
