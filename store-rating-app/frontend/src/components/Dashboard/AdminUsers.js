import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

// StarRating component for displaying average rating as stars
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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await API.get("/users", { params: userFilters });
        setUsers(usersRes.data.users || []);
      } catch (e) {
        setMsg("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [userFilters, msg]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/api/auth/register", { ...newUser, fromAdmin: true });
      setMsg("User added successfully!");
      setShowUserModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
      });
      setUserFilters({ ...userFilters }); // trigger refresh
    } catch (err) {
      setMsg("Failed to add user");
    }
  };

  const handleViewUser = async (userId) => {
    setSelectedUser(userId);
    setUserDetail(null);
    try {
      const res = await API.get(`/users/${userId}`);
      setUserDetail(res.data.user);
    } catch {
      setUserDetail(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${userId}`);
      setMsg("User deleted successfully!");
      setUserFilters({ ...userFilters }); // refresh
    } catch {
      setMsg("Failed to delete user");
    }
  };

  const handleUserFilterChange = (e) =>
    setUserFilters({ ...userFilters, [e.target.name]: e.target.value });

  // Helper to calculate average rating for a user (across all their stores)
  function getUserAverageRating(user) {
    if (!user.stores || user.stores.length === 0) return null;
    let total = 0;
    let count = 0;
    user.stores.forEach((store) => {
      if (store.ratings && store.ratings.length > 0) {
        total += store.ratings.reduce((sum, r) => sum + r.rating, 0);
        count += store.ratings.length;
      }
    });
    if (count === 0) return null;
    return total / count;
  }

  // Helper to calculate average rating for a store
  function getStoreAverageRating(store) {
    if (!store.ratings || store.ratings.length === 0) return null;
    const total = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    return total / store.ratings.length;
  }

  return (
    <div className="container py-4" style={{ maxWidth: 1300 }}>
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
      {msg && (
        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
          style={{
            position: "relative",
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: "0.03em",
            background: "#e8f7f0",
            color: "#232946",
            borderRadius: "1.2rem",
            boxShadow: "0 2px 8px 0 rgba(67,206,162,0.07)",
            border: "1.5px solid #43cea2",
            paddingRight: 40,
          }}
        >
          {msg}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              filter: "invert(0.5)",
              opacity: 0.7,
            }}
            onClick={() => setMsg("")}
          ></button>
        </div>
      )}
      <div className="mb-4 d-flex gap-3 align-items-center">
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
          onClick={() => setShowUserModal(true)}
          onMouseOver={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)")
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
          Add User
        </button>
      </div>
      <div className="row mb-3 g-2">
        <div className="col">
          <input
            className="form-control"
            name="name"
            placeholder="Name"
            value={userFilters.name}
            onChange={handleUserFilterChange}
            style={{
              borderRadius: "1.2rem",
              border: "1.5px solid #e4e5e9",
              fontSize: 16,
              padding: "0.7rem 1.2rem",
            }}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            name="email"
            placeholder="Email"
            value={userFilters.email}
            onChange={handleUserFilterChange}
            style={{
              borderRadius: "1.2rem",
              border: "1.5px solid #e4e5e9",
              fontSize: 16,
              padding: "0.7rem 1.2rem",
            }}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            name="address"
            placeholder="Address"
            value={userFilters.address}
            onChange={handleUserFilterChange}
            style={{
              borderRadius: "1.2rem",
              border: "1.5px solid #e4e5e9",
              fontSize: 16,
              padding: "0.7rem 1.2rem",
            }}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            name="role"
            value={userFilters.role}
            onChange={handleUserFilterChange}
            style={{
              borderRadius: "1.2rem",
              border: "1.5px solid #e4e5e9",
              fontSize: 16,
              padding: "0.7rem 1.2rem",
            }}
          >
            <option value="">All Roles</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>
      {/* Modern Card Grid for Users */}
      <div
        className="row g-4"
        style={{
          marginTop: 8,
          marginBottom: 24,
        }}
      >
        {users.length === 0 ? (
          <div
            className="col-12 text-center text-muted"
            style={{ fontSize: 20 }}
          >
            No users found.
          </div>
        ) : (
          users.map((u) => {
            // Remove unused avgRating variable
            return (
              <div
                className="col-md-6 col-lg-4"
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <div
                  className="shadow-sm"
                  style={{
                    borderRadius: "2rem",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
                    boxShadow: "0 4px 24px 0 rgba(67,206,162,0.08)",
                    padding: "2.2rem 2rem 1.5rem 2rem",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minHeight: 210,
                    position: "relative",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #43cea2 0%, #4e54c8 100%)",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                        textTransform: "uppercase",
                      }}
                    >
                      {u.name ? u.name[0] : "U"}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 22,
                          color: "#232946",
                        }}
                      >
                        {u.name}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginBottom: 6,
                      color: "#232946",
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ opacity: 0.7 }}>Address:</span> {u.address}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        borderRadius: "1rem",
                        padding: "0.2rem 1.1rem",
                        fontWeight: 700,
                        background:
                          "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)",
                        color: "#fff",
                        fontSize: 15,
                        letterSpacing: "0.03em",
                        boxShadow: "0 1px 6px 0 rgba(67,206,162,0.10)",
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: "auto",
                      width: "100%",
                    }}
                  >
                    <button
                      className="btn btn-outline-info btn-sm"
                      style={{
                        borderRadius: "1.2rem",
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "0.3rem 1.1rem",
                        border: "1.5px solid #0d6efd",
                        color: "#0d6efd",
                        background: "#f8fafc",
                        transition: "background 0.2s, color 0.2s",
                        flex: 1,
                      }}
                      onClick={() => handleViewUser(u.id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{
                        borderRadius: "1.2rem",
                        fontWeight: 600,
                        fontSize: 15,
                        padding: "0.3rem 1.1rem",
                        background:
                          "linear-gradient(90deg, #ff5858 0%, #f7971e 100%)",
                        border: "none",
                        color: "#fff",
                        boxShadow: "0 1px 6px 0 rgba(247,151,30,0.10)",
                        transition: "background 0.2s, color 0.2s",
                        flex: 1,
                      }}
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* User Detail Modal */}
      {selectedUser && userDetail && (
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
          onClick={() => setSelectedUser(null)}
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
                background: "linear-gradient(135deg, #f8fafc 0%, #e4e5e9 100%)",
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
                  User Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  style={{
                    filter: "invert(1) grayscale(1)",
                    opacity: 0.7,
                    marginLeft: 10,
                  }}
                  onClick={() => setSelectedUser(null)}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #43cea2 0%, #4e54c8 100%)",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px 0 rgba(67,206,162,0.10)",
                      textTransform: "uppercase",
                    }}
                  >
                    {userDetail.name ? userDetail.name[0] : "U"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 24 }}>
                      {userDetail.name}
                    </div>
                    <div style={{ color: "#555", fontSize: 16 }}>
                      {userDetail.email}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ opacity: 0.7 }}>Address:</span>{" "}
                  {userDetail.address}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      borderRadius: "1rem",
                      padding: "0.2rem 1.1rem",
                      fontWeight: 700,
                      background:
                        "linear-gradient(90deg, #4e54c8 0%, #43cea2 100%)",
                      color: "#fff",
                      fontSize: 15,
                      letterSpacing: "0.03em",
                      boxShadow: "0 1px 6px 0 rgba(67,206,162,0.10)",
                    }}
                  >
                    {userDetail.role}
                  </span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <span style={{ opacity: 0.7 }}>Email:</span>{" "}
                  {userDetail.email}
                </div>
                {/* Show overall avg rating for Store Owner */}
                {userDetail.role === "Store Owner" &&
                  userDetail.stores &&
                  userDetail.stores.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ fontWeight: 700, color: "#232946" }}>
                        Rating:{" "}
                      </span>
                      {(() => {
                        const avg = getUserAverageRating(userDetail);
                        return avg !== null ? (
                          <>
                            <StarRating value={avg} />
                            {/* Removed numeric rating */}
                          </>
                        ) : (
                          <span
                            style={{
                              color: "#888",
                              fontWeight: 500,
                              fontSize: 15,
                            }}
                          >
                            N/A
                          </span>
                        );
                      })()}
                    </div>
                  )}
                {/* List all stores with their avg rating */}
                {userDetail.role === "Store Owner" &&
                  userDetail.stores &&
                  userDetail.stores.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                      <h6 style={{ fontWeight: 800, fontSize: 17 }}>
                        Owned Stores & Ratings
                      </h6>
                      <ul style={{ paddingLeft: 18 }}>
                        {userDetail.stores.map((store) => {
                          const storeAvg = getStoreAverageRating(store);
                          return (
                            <li key={store.id} style={{ marginBottom: 4 }}>
                              <span style={{ fontWeight: 700 }}>
                                {store.name}
                              </span>
                              {" :  "}
                              {storeAvg !== null ? (
                                <>
                                  <StarRating value={storeAvg} />
                                  {/* Removed numeric rating */}
                                </>
                              ) : (
                                <span
                                  style={{
                                    color: "#888",
                                    fontWeight: 500,
                                    fontSize: 15,
                                  }}
                                >
                                  N/A
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add User Modal */}
      {showUserModal && (
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
          onClick={() => setShowUserModal(false)}
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
              <form onSubmit={handleAddUser}>
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
                    Add User
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    style={{
                      filter: "invert(1) grayscale(1)",
                      opacity: 0.7,
                      marginLeft: 10,
                    }}
                    onClick={() => setShowUserModal(false)}
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
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
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
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
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
                      Password
                    </label>
                    <input
                      className="form-control"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                      minLength={8}
                      maxLength={16}
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
                      value={newUser.address}
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
                      maxLength={400}
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
                      Role
                    </label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      style={{
                        borderRadius: "1.2rem",
                        border: "1.5px solid #e4e5e9",
                        fontSize: 16,
                        padding: "0.7rem 1.2rem",
                      }}
                    >
                      <option value="Normal User">Normal User</option>
                      <option value="Store Owner">Store Owner</option>
                      <option value="System Administrator">
                        System Administrator
                      </option>
                    </select>
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
                    Add User
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
