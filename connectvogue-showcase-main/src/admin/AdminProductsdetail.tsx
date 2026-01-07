"use client";
import { useEffect, useState } from "react";
import { safeFetch } from "../../src/api/fetchClient"; // ✅ added

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  // ✅ Fetch products using safeFetch
  useEffect(() => {
    safeFetch<any[]>("/api/productdetails")
      .then(setProducts)
      .catch(console.error);
  }, []);

  // ✅ Delete product using safeFetch
  const deleteProduct = async (id: string) => {
    await safeFetch(`/api/productdetails/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin – Products</h1>

      {products.map(p => (
        <div key={p._id} className="border p-4 mb-4 flex justify-between">
          <div>
            <p className="font-semibold">{p.name}</p>
            <p>₹{p.price}</p>
          </div>
          <button
            onClick={() => deleteProduct(p._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
