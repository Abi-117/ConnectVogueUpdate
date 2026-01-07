import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { safeFetch } from "../../src/api/fetchClient"; // ✅ added

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const data = await safeFetch<{ token?: string; msg?: string }>(
      "/api/admin/login",
      {
        method: "POST",
        body: { email, password },
      }
    );

    // ✅ VERY IMPORTANT CHECK
    if (!data || !data.token) {
      alert(data?.msg || "Admin not found or invalid credentials");
      return;
    }

    localStorage.setItem("adminToken", data.token);
    navigate("/admin/dashboard");

  } catch (err) {
    console.error("Login error:", err);
    alert("❌ Login failed. Check backend.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 w-96 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
