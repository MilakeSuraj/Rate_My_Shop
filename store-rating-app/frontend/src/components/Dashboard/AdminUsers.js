import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

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
      <h2 className="mb-4 text-center">Users</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="mb-4 d-flex gap-2">
        <button
          className="btn btn-success"
          onClick={() => setShowUserModal(true)}
        >
          Add User
        </button>
      </div>
      <div className="row mb-2">
        <div className="col">
          <input
            className="form-control"
            name="name"
            placeholder="Name"
            value={userFilters.name}
            onChange={handleUserFilterChange}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            name="email"
            placeholder="Email"
            value={userFilters.email}
            onChange={handleUserFilterChange}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            name="address"
            placeholder="Address"
            value={userFilters.address}
            onChange={handleUserFilterChange}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            name="role"
            value={userFilters.role}
            onChange={handleUserFilterChange}
          >
            <option value="">All Roles</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
            <option value="System Administrator">System Administrator</option>
          </select>
        </div>
      </div>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Details</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => handleViewUser(u.id)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* User Detail Modal */}
      {selectedUser && userDetail && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setSelectedUser(null)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {userDetail.name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetail.email}
                </p>
                <p>
                  <strong>Address:</strong> {userDetail.address}
                </p>
                <p>
                  <strong>Role:</strong> {userDetail.role}
                </p>
                {userDetail.role === "Store Owner" &&
                  userDetail.stores &&
                  userDetail.stores.length > 0 && (
                    <>
                      <h6>Owned Stores & Ratings</h6>
                      <ul>
                        {userDetail.stores.map((store) => (
                          <li key={store.id}>
                            {store.name} - Avg Rating:{" "}
                            {store.ratings && store.ratings.length > 0
                              ? (
                                  store.ratings.reduce(
                                    (sum, r) => sum + r.rating,
                                    0
                                  ) / store.ratings.length
                                ).toFixed(2)
                              : "N/A"}
                          </li>
                        ))}
                      </ul>
                    </>
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
          onClick={() => setShowUserModal(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <form onSubmit={handleAddUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Add User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUserModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      required
                      minLength={2}
                      maxLength={60}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Password</label>
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
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Address</label>
                    <input
                      className="form-control"
                      value={newUser.address}
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
                      maxLength={400}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    >
                      <option value="Normal User">Normal User</option>
                      <option value="Store Owner">Store Owner</option>
                      <option value="System Administrator">
                        System Administrator
                      </option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" type="submit">
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
