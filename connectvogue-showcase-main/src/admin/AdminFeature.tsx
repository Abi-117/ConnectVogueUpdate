"use client";
import { useEffect, useState } from "react";
import { safeFetch } from "../../src/api/fetchClient";


const iconOptions = ["Truck", "RefreshCw", "Shield", "Headphones"];

export default function AdminFeature() {
  const [features, setFeatures] = useState<any[]>([
    { icon: "Truck", title: "", description: "", order: 1 },
  ]);

useEffect(() => {
  safeFetch<any[]>("/api/features").then(data => {
    if (Array.isArray(data) && data.length) {
      setFeatures(data);
    }
  });
}, []);

  const handleChange = (i: number, key: string, value: string) => {
    const updated = [...features];
    updated[i][key] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        icon: "Truck",
        title: "",
        description: "",
        order: features.length + 1,
      },
    ]);
  };

  const saveFeatures = async () => {
  const res = await safeFetch(
    "/api/features",
    {
      method: "PUT",
      body: features,
    }
  );

  if (res) {
    alert("Features updated ✅");
  } else {
    alert("Update failed ❌");
  }
};


  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin – Feature Banner</h1>

      {features.map((f, i) => (
        <div key={i} className="border p-4 space-y-2">
          <select
            value={f.icon}
            onChange={e => handleChange(i, "icon", e.target.value)}
            className="border p-2 w-full"
          >
            {iconOptions.map(icon => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>

          <input
            value={f.title}
            onChange={e => handleChange(i, "title", e.target.value)}
            placeholder="Title"
            className="border p-2 w-full"
          />

          <input
            value={f.description}
            onChange={e => handleChange(i, "description", e.target.value)}
            placeholder="Description"
            className="border p-2 w-full"
          />
        </div>
      ))}

      <button
        onClick={addFeature}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Add Feature
      </button>

      <button
        onClick={saveFeatures}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Features
      </button>
    </div>
  );
}
