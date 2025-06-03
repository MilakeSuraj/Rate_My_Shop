import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/auth/login", form);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // Redirect based on role
        if (res.data.user.role === "System Administrator") navigate("/admin");
        else if (res.data.user.role === "Store Owner") navigate("/owner");
        else navigate("/user");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
