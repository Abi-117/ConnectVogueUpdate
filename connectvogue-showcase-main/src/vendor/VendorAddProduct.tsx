"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { safeFetch } from "../../src/api/fetchClient";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Color {
  name: string;
  hex: string;
}

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  description?: string;
  sizes: string[];
  colors: Color[];
  image?: File | null;
}

const CATEGORY_SIZES: Record<string, string[]> = {
  "Men's Fashion": ["XS", "S", "M", "L", "XL", "XXL"],
  "Women's Fashion": ["XS", "S", "M", "L", "XL"],
  Footwear: ["6", "7", "8", "9", "10", "11"],
  Sportswear: ["S", "M", "L", "XL"],
  Electronics: ["64GB", "128GB", "256GB", "512GB"],
  Accessories: ["One Size"],
  "Seasonal Gifts": ["Small", "Medium", "Large"],
  "Home & Lifestyle": ["Small", "Medium", "Large", "XL"],
};

export default function VendorAddProduct() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState<Product>({
    name: "",
    price: 0,
    category: "",
    sizes: [],
    colors: [],
    image: null,
  });

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  useEffect(() => {
    safeFetch<Category[]>("/api/categories").then(setCategories).catch(console.error);
  }, []);

  const selectedCategory = categories.find(
    (c) => c.slug === productData.category
  );

  const sizesForCategory =
    (selectedCategory && CATEGORY_SIZES[selectedCategory.name]) || [];

  const toggleSize = (size: string) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    if (!colorName) return;
    setProductData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: colorName, hex: colorHex }],
    }));
    setColorName("");
    setColorHex("#000000");
  };

  const handleAddProduct = async () => {
    if (!productData.name || !productData.price || !productData.category) {
      alert("Name, Price & Category are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("price", String(productData.price));
      formData.append("category", productData.category);
      formData.append("sizes", JSON.stringify(productData.sizes));
      formData.append("colors", JSON.stringify(productData.colors));

      if (productData.originalPrice)
        formData.append("originalPrice", String(productData.originalPrice));

      if (productData.image)
        formData.append("image", productData.image);

      await safeFetch("/api/products/vendor", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("vendorToken"),
        },
      });

      window.dispatchEvent(new CustomEvent("vendor-product-added"));
      alert("Product added successfully");

      setProductData({
        name: "",
        price: 0,
        category: "",
        sizes: [],
        colors: [],
        image: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">Vendor – Add Product</h1>

      <div className="bg-white border rounded-xl p-6 space-y-6 shadow">

        {/* Product Name */}
        <label htmlFor="productName" className="sr-only">Product Name</label>
        <input
          id="productName"
          name="productName"
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          value={productData.name}
          onChange={(e) =>
            setProductData({ ...productData, name: e.target.value })
          }
        />

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="price" className="sr-only">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: Number(e.target.value) })
            }
          />

          <label htmlFor="originalPrice" className="sr-only">Original Price</label>
          <input
            id="originalPrice"
            name="originalPrice"
            type="number"
            placeholder="Original Price"
            className="border p-2 rounded"
            value={productData.originalPrice || ""}
            onChange={(e) =>
              setProductData({
                ...productData,
                originalPrice: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Category */}
        <label htmlFor="category" className="sr-only">Category</label>
        <select
          id="category"
          name="category"
          className="border p-2 rounded w-full"
          value={productData.category}
          onChange={(e) =>
            setProductData({ ...productData, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Sizes */}
        {sizesForCategory.length > 0 && (
          <div>
            <p className="font-medium mb-2">Sizes</p>
            <div className="flex gap-2 flex-wrap">
              {sizesForCategory.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    productData.sizes.includes(size)
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        <div>
          <p className="font-medium mb-2">Colors</p>
          <div className="flex gap-2">
            <label htmlFor="colorName" className="sr-only">Color Name</label>
            <input
              id="colorName"
              name="colorName"
              placeholder="Color name"
              className="border p-2 rounded flex-1"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />

            <label htmlFor="colorHex" className="sr-only">Color Picker</label>
            <input
              id="colorHex"
              name="colorHex"
              type="color"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
            />

            <Button type="button" onClick={addColor}>Add</Button>
          </div>
        </div>

        {/* Image Upload */}
        <label htmlFor="productImage" className="sr-only">Product Image</label>
        <input
          id="productImage"
          name="productImage"
          type="file"
          accept="image/*"
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setProductData({ ...productData, image: e.target.files?.[0] || null })
          }
        />

        <Button className="w-full" disabled={loading} onClick={handleAddProduct}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </div>
    </div>
  );
}
