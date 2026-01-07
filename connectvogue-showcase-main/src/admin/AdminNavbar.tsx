import { useEffect, useState } from "react";
import { safeFetch } from "../../src/api/fetchClient";


interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminNavbar() {
  const [categories, setCategories] = useState<Category[]>([]);

 useEffect(() => {
  safeFetch<Category[]>("/api/categories").then(data => {
    if (Array.isArray(data)) {
      setCategories(data);
    } else {
      setCategories([]);
    }
  });
}, []);

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Navbar (Auto from Categories)</h1>

      {categories.map(cat => (
        <div key={cat._id} className="border-b py-2">
          <span className="font-medium">{cat.name}</span>
          <span className="text-gray-500 ml-2">
            /category/{cat.slug}
          </span>
        </div>
      ))}
    </div>
  );
}
