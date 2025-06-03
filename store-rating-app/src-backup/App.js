import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import OwnerDashboard from "./components/Dashboard/OwnerDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import StoreDetail from "./components/Stores/StoreDetail";
import StoreList from "./components/Stores/StoreList";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  // Add role-based redirect on "/" route
  // This assumes you have a way to get the current user and their role (e.g., from localStorage)
  // If not, you can skip this and just ensure /admin route is the dashboard for admins

  // Example: role-based redirect for "/"
  // (If you don't want to use hooks here, just ensure /admin route is the dashboard for admins)
  // Remove or comment out the line below if you don't want to use hooks in this file.
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user?.role === "Admin") navigate("/admin");
  //   else if (user?.role === "Store Owner") navigate("/owner");
  //   else if (user?.role === "Normal User") navigate("/user");
  // }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // Role-based redirect for root path
            (() => {
              const user = JSON.parse(localStorage.getItem("user"));
              if (user?.role === "Admin") return <AdminDashboard />;
              if (user?.role === "Store Owner") return <OwnerDashboard />;
              if (user?.role === "Normal User") return <UserDashboard />;
              return <Home />;
            })()
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
