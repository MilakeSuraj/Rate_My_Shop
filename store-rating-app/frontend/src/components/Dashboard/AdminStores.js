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

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: "", address: "" });
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    userId: "",
    image: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesRes = await API.get("/api/stores", {
          params: storeFilters,
        });
        setStores(storesRes.data.stores || []);
      } catch (e) {
        setMsg("Failed to fetch stores");
      }
    };
    fetchStores();
  }, [storeFilters, msg]);

  const handleAddStore = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/api/stores", newStore);
      setMsg("Store added successfully!");
      setShowStoreModal(false);
      setNewStore({ name: "", email: "", address: "", userId: "", image: "" });
      setStoreFilters({ ...storeFilters }); // trigger refresh
    } catch (err) {
      setMsg("Failed to add store");
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await API.delete(`/api/stores/${storeId}`, {
        data: { userId: null, role: "Admin" },
      });
      setMsg("Store deleted successfully!");
      setStoreFilters({ ...storeFilters }); // refresh
    } catch {
      setMsg("Failed to delete store");
    }
  };

  const handleStoreFilterChange = (e) =>
    setStoreFilters({ ...storeFilters, [e.target.name]: e.target.value });

  return (
    <div className="container py-4">
      <button
        className="btn btn-light mb-3 d-flex align-items-center shadow-sm"
        style={{
          borderRadius: "2rem",
          padding: "0.5rem 1.2rem",
          fontWeight: 500,
          fontSize: 18,
          gap: 8,
          border: "1px solid #dee2e6",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        onClick={() => navigate("/admin")}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="#0d6efd"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          style={{ marginRight: 6 }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </button>
      <h2 className="mb-4 text-center">Stores</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="mb-4 d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => setShowStoreModal(true)}
        >
          Add Store
        </button>
      </div>
      <div className="row mb-2">
        <div className="col">
          <input
            className="form-control"
            name="name"
            placeholder="Name"
            value={storeFilters.name}
            onChange={handleStoreFilterChange}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            name="address"
            placeholder="Address"
            value={storeFilters.address}
            onChange={handleStoreFilterChange}
          />
        </div>
      </div>
      <div className="row g-4">
        {stores.length === 0 ? (
          <div className="col-12 text-center text-muted">No stores found.</div>
        ) : (
          stores.map((store) => (
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
                    <strong>Email:</strong> {store.email}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Address:</strong> {store.address}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Owner:</strong>{" "}
                    {store.owner ? store.owner.name : "N/A"}
                  </p>
                  <p
                    className="mb-2 d-flex align-items-center"
                    style={{ minHeight: 32 }}
                  >
                    <span style={{ fontWeight: 600, marginRight: 6 }}>
                      Rating:
                    </span>
                    <StarRating value={parseFloat(store.averageRating ?? 0)} />
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
          ))
        )}
      </div>
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
                    <label className="form-label">Owner (User ID)</label>
                    <input
                      className="form-control"
                      value={newStore.userId}
                      onChange={(e) =>
                        setNewStore({ ...newStore, userId: e.target.value })
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
