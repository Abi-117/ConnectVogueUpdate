"use client";
import { useState } from "react";
import { safeFetch } from "../../src/api/fetchClient";


export default function AdminCreateVendor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const createVendor = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Email & Password required");
    return;
  }

  setLoading(true);

  try {
    const data = await safeFetch<{ msg?: string }>(
      "/api/users/admin/vendor",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("adminToken"),
        },
        body: { email, password },
      }
    );

    if (!data) {
      alert("Failed to create vendor");
      return;
    }

    alert("✅ Vendor created successfully");
    setEmail("");
    setPassword("");
  } catch (err) {
    console.error(err);
    alert("❌ Error creating vendor");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">
        Create Vendor
      </h1>

      <form
        onSubmit={createVendor}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="email"
          placeholder="Vendor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded"
        >
          {loading ? "Creating..." : "Create Vendor"}
        </button>
      </form>
    </div>
  );
}
