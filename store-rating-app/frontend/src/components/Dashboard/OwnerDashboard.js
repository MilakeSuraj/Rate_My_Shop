import { useEffect, useState } from "react";
import API from "../../api";
import { useAuth } from "../../App";

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

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    image: "",
  });
  const [msg, setMsg] = useState("");
  const [hovered, setHovered] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null); // <-- for modal
  const [storeDetail, setStoreDetail] = useState(null); // <-- store info with ratings
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchOwnerStores = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all stores, then filter by owner.id
        const storesRes = await API.get("/api/stores");
        let storesData = [];
        if (storesRes.data && storesRes.data.stores) {
          // Filter stores where owner.id matches the logged-in owner
          storesData = storesRes.data.stores.filter(
            (store) => store.owner && String(store.owner.id) === String(user.id)
          );
        }
        const storesWithOwner = storesData.map((store) => ({
          ...store,
          owner: store.owner || { name: user.name },
          averageRating:
            store.ratings && store.ratings.length > 0
              ? (
                  store.ratings.reduce((sum, r) => sum + r.rating, 0) /
                  store.ratings.length
                ).toFixed(2)
              : "N/A",
        }));
        setStores(storesWithOwner);
      } catch (err) {
        setError("Failed to fetch your stores");
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "Store Owner") {
      fetchOwnerStores();
    }
  }, [user, msg]);

  // Delete store (owner can only delete own)
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await API.delete(`/api/stores/${storeId}`, {
        data: { userId: user.id, role: user.role },
      });
      setMsg("Store deleted successfully!");
    } catch {
      setMsg("Failed to delete store");
    }
  };

  // Show store detail modal
  const handleViewStore = async (storeId) => {
    setDetailLoading(true);
    setSelectedStore(storeId);
    setStoreDetail(null);
    try {
      // Fetch all stores with ratings, then find the one with the matching id
      const res = await API.get("/api/ratings/by-store");
      const found = (res.data.stores || []).find(
        (s) => String(s.id) === String(storeId)
      );
      setStoreDetail(found || null);
    } catch {
      setStoreDetail(null);
    }
    setDetailLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 60% 40%, #3d3356 0%, #232135 100%)",
      }}
    >
      <div className="container py-5">
        <h2 className="mb-4 text-center">Owner Dashboard</h2>
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
        {/* Add Store Button */}
        <div className="mb-4 d-flex gap-2" style={{ alignItems: "center" }}>
          <button
            className="btn"
            style={{
              background: "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              borderRadius: "1.5rem",
              padding: "0.6rem 2.2rem",
              boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
              border: "none",
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={() => setShowStoreModal(true)}
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Add Store
          </button>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : stores.length === 0 ? (
          <div className="alert alert-info text-center">
            You do not own any stores yet.
          </div>
        ) : (
          <div className="row g-4">
            {stores.map((store, idx) => (
              <div
                className="col-md-6 col-lg-4"
                key={store.id}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
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
                      ? "scale(1.07)"
                      : "scale(0.93)",
                  opacity: hovered === null ? 1 : hovered === idx ? 1 : 0.7,
                }}
              >
                <div
                  className="card h-100 shadow-sm"
                  style={{ transition: "all 0.3s cubic-bezier(.4,2,.6,1)" }}
                >
                  <img
                    src={
                      store.image && store.image !== ""
                        ? store.image
                        : "https://via.placeholder.com/400x200?text=No+Image"
                    }
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
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{store.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Email:</strong> {store.email}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Address:</strong> {store.address}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Owner:</strong>{" "}
                      {store.owner ? store.owner.name : "You"}
                    </p>
                    <p
                      className="mb-2 d-flex align-items-center"
                      style={{ minHeight: 32 }}
                    >
                      <span style={{ fontWeight: 600, marginRight: 6 }}>
                        Rating:
                      </span>
                      <StarRating
                        value={parseFloat(store.averageRating) || 0}
                      />
                    </p>
                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => handleViewStore(store.id)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => handleDeleteStore(store.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Store Detail Modal */}
        {selectedStore && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
              background: "rgba(44, 62, 80, 0.25)",
              backdropFilter: "blur(4px)",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1050,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedStore(null)}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: 500,
                width: "95%",
                margin: "0 auto",
                borderRadius: "2rem",
                boxShadow: "0 8px 48px 0 rgba(67,206,162,0.18)",
                background: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  borderRadius: "2rem",
                  boxShadow: "0 4px 32px 0 rgba(67,206,162,0.13)",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                  padding: "0.5rem 0.5rem 1.5rem 0.5rem",
                  position: "relative",
                }}
              >
                <div
                  className="modal-header"
                  style={{
                    border: "none",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem",
                    background:
                      "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                    color: "#fff",
                    padding: "1.2rem 2rem 1rem 2rem",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <h5
                    className="modal-title"
                    style={{
                      fontWeight: 900,
                      fontSize: "2rem",
                      letterSpacing: "0.07em",
                      width: "100%",
                    }}
                  >
                    Store Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    style={{
                      filter: "invert(1) grayscale(1)",
                      opacity: 0.7,
                      marginLeft: 10,
                    }}
                    onClick={() => setSelectedStore(null)}
                  ></button>
                </div>
                <div
                  className="modal-body"
                  style={{
                    padding: "1.5rem 2rem 0.5rem 2rem",
                    fontSize: 17,
                    color: "#232946",
                    fontWeight: 600,
                  }}
                >
                  {detailLoading || !storeDetail ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      />
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Name:</strong> {storeDetail.name}
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Email:</strong> {storeDetail.email}
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Address:</strong> {storeDetail.address}
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Average Rating:</strong>{" "}
                        <StarRating
                          value={
                            storeDetail.ratings &&
                            storeDetail.ratings.length > 0
                              ? storeDetail.ratings.reduce(
                                  (sum, r) => sum + r.rating,
                                  0
                                ) / storeDetail.ratings.length
                              : 0
                          }
                        />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <strong>Ratings by user:</strong>
                        {!storeDetail.ratings ||
                        storeDetail.ratings.length === 0 ? (
                          <div className="text-muted">No ratings yet.</div>
                        ) : (
                          <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                            {storeDetail.ratings.map((r) => (
                              <li
                                key={r.id}
                                style={{
                                  marginBottom: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>
                                  {r.user ? r.user.name : "User"}
                                </span>
                                <StarRating value={r.rating} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Store Modal */}
        {showStoreModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
              background: "rgba(44, 62, 80, 0.25)",
              backdropFilter: "blur(4px)",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1050,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowStoreModal(false)}
          >
            <div
              className="modal-dialog"
              style={{
                maxWidth: 500,
                width: "95%",
                margin: "0 auto",
                borderRadius: "2rem",
                boxShadow: "0 8px 48px 0 rgba(67,206,162,0.18)",
                background: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modal-content"
                style={{
                  borderRadius: "2rem",
                  boxShadow: "0 4px 32px 0 rgba(67,206,162,0.13)",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                  padding: "0.5rem 0.5rem 1.5rem 0.5rem",
                  position: "relative",
                }}
              >
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setMsg("");
                    try {
                      await API.post("/api/stores", {
                        ...newStore,
                        userId: user.id,
                      });
                      setMsg("Store added successfully!");
                      setShowStoreModal(false); // close popup on success
                      setNewStore({
                        name: "",
                        email: "",
                        address: "",
                        image: "",
                      });
                    } catch {
                      setMsg("Failed to add store");
                    }
                  }}
                >
                  <div
                    className="modal-header"
                    style={{
                      border: "none",
                      borderTopLeftRadius: "2rem",
                      borderTopRightRadius: "2rem",
                      background:
                        "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                      color: "#fff",
                      padding: "1.2rem 2rem 1rem 2rem",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        fontWeight: 900,
                        fontSize: "2rem",
                        letterSpacing: "0.07em",
                        width: "100%",
                      }}
                    >
                      Add Store
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      style={{
                        filter: "invert(1) grayscale(1)",
                        opacity: 0.7,
                        marginLeft: 10,
                      }}
                      onClick={() => setShowStoreModal(false)}
                    ></button>
                  </div>
                  <div
                    className="modal-body"
                    style={{
                      padding: "1.5rem 2rem 0.5rem 2rem",
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Name
                      </label>
                      <input
                        className="form-control"
                        value={newStore.name}
                        onChange={(e) =>
                          setNewStore({ ...newStore, name: e.target.value })
                        }
                        required
                        minLength={2}
                        maxLength={60}
                        style={{
                          borderRadius: "1.2rem",
                          border: "1.5px solid #e4e5e9",
                          fontSize: 16,
                          padding: "0.7rem 1.2rem",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Email
                      </label>
                      <input
                        className="form-control"
                        value={newStore.email}
                        onChange={(e) =>
                          setNewStore({ ...newStore, email: e.target.value })
                        }
                        required
                        style={{
                          borderRadius: "1.2rem",
                          border: "1.5px solid #e4e5e9",
                          fontSize: 16,
                          padding: "0.7rem 1.2rem",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Address
                      </label>
                      <input
                        className="form-control"
                        value={newStore.address}
                        onChange={(e) =>
                          setNewStore({ ...newStore, address: e.target.value })
                        }
                        maxLength={400}
                        required
                        style={{
                          borderRadius: "1.2rem",
                          border: "1.5px solid #e4e5e9",
                          fontSize: 16,
                          padding: "0.7rem 1.2rem",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Image
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewStore((prev) => ({
                                ...prev,
                                image: reader.result,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{
                          borderRadius: "1.2rem",
                          border: "1.5px solid #e4e5e9",
                          fontSize: 16,
                          padding: "0.7rem 1.2rem",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="modal-footer"
                    style={{
                      border: "none",
                      padding: "1.2rem 2rem 1.5rem 2rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      className="btn"
                      type="submit"
                      style={{
                        background:
                          "linear-gradient(90deg, #43cea2 0%, #4e54c8 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: "1.5rem",
                        padding: "0.7rem 2.5rem",
                        boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                        border: "none",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      Add Store
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
