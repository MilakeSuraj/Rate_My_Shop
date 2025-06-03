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
  const [hoveredStore, setHoveredStore] = useState(null);
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
      {/* Remove the Stores heading */}
      {msg && <div className="alert alert-info">{msg}</div>}
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
            <div
              className="col-md-6 col-lg-4"
              key={store.id}
              onMouseEnter={() => setHoveredStore(store.id)}
              onMouseLeave={() => setHoveredStore(null)}
              style={{
                transition: "all 0.33s cubic-bezier(.4,2,.6,1)",
                zIndex: hoveredStore === store.id ? 2 : 1,
                filter:
                  hoveredStore === null
                    ? "none"
                    : hoveredStore === store.id
                    ? "none"
                    : "blur(2px) grayscale(0.3) brightness(0.9)",
                opacity:
                  hoveredStore === null
                    ? 1
                    : hoveredStore === store.id
                    ? 1
                    : 0.7,
                transform:
                  hoveredStore === null
                    ? "scale(1)"
                    : hoveredStore === store.id
                    ? "scale(1.07)"
                    : "scale(0.93)",
              }}
            >
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
              maxWidth: 420,
              width: "95%",
              margin: "0 auto",
              borderRadius: "2rem",
              boxShadow: "0 8px 48px 0 rgba(67,206,162,0.18)",
              background: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "2rem",
                boxShadow: "0 4px 32px 0 rgba(67,206,162,0.13)",
                border: "none",
                background: "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                padding: "0.5rem 0.5rem 1.5rem 0.5rem",
                position: "relative",
              }}
            >
              <form onSubmit={handleAddStore}>
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
                      Owner (User ID)
                    </label>
                    <input
                      className="form-control"
                      value={newStore.userId}
                      onChange={(e) =>
                        setNewStore({ ...newStore, userId: e.target.value })
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
  );
}
