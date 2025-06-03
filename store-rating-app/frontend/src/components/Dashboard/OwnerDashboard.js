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
  const [hovered, setHovered] = useState(null); // <-- add this

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

  // Add store (owner)
  const handleAddStore = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/api/stores", {
        ...newStore,
        userId: user.id,
      });
      setMsg("Store added successfully!");
      setShowStoreModal(false);
      setNewStore({ name: "", email: "", address: "", image: "" });
    } catch {
      setMsg("Failed to add store");
    }
  };

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

  return (
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
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowStoreModal(true)}
      >
        Add Store
      </button>
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
                    <StarRating value={parseFloat(store.averageRating) || 0} />
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <a
                      href={`/stores/${store.id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      View
                    </a>
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

      {/* Add Store Modal */}
      {showStoreModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setShowStoreModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <form onSubmit={handleAddStore}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Store</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowStoreModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={newStore.name}
                      onChange={(e) =>
                        setNewStore({ ...newStore, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      value={newStore.email}
                      onChange={(e) =>
                        setNewStore({ ...newStore, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Address</label>
                    <input
                      className="form-control"
                      value={newStore.address}
                      onChange={(e) =>
                        setNewStore({ ...newStore, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Image</label>
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
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Add Store
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
