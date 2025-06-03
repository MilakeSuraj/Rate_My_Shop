import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "Normal User",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/auth/register", form);
      if (res.data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="Normal User">Normal User</option>
        <option value="Store Owner">Store Owner</option>
        <option value="System Administrator">System Administrator</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
