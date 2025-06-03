import { createContext, useContext, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import AdminStoreRatings from "./components/Dashboard/AdminStoreRatings";
import AdminStores from "./components/Dashboard/AdminStores";
import AdminUsers from "./components/Dashboard/AdminUsers";
import OwnerDashboard from "./components/Dashboard/OwnerDashboard";
import Requests from "./components/Dashboard/Requests"; // <-- create this component
import UserDashboard from "./components/Dashboard/UserDashboard";
import Navbar from "./components/Layout/Navbar";
import StoreDetail from "./components/Stores/StoreDetail";
import StoreList from "./components/Stores/StoreList";
import NotFound from "./pages/NotFound";

// Auth context for global auth state
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = (user) => setUser(user);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Route protection
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={
              user.role === "Admin"
                ? "/admin"
                : user.role === "Store Owner"
                ? "/owner"
                : "/user"
            }
            replace
          />
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["Admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner"
        element={
          <PrivateRoute roles={["Store Owner"]}>
            <OwnerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/user"
        element={
          <PrivateRoute roles={["Normal User"]}>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/stores"
        element={
          <PrivateRoute roles={["Normal User", "Store Owner"]}>
            <StoreList />
          </PrivateRoute>
        }
      />
      <Route
        path="/stores/:id"
        element={
          <PrivateRoute roles={["Normal User", "Admin", "Store Owner"]}>
            <StoreDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <PrivateRoute roles={["Admin"]}>
            <Requests />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute roles={["Admin"]}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <PrivateRoute roles={["Admin"]}>
            <AdminStores />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/store-ratings"
        element={
          <PrivateRoute roles={["Admin"]}>
            <AdminStoreRatings />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
