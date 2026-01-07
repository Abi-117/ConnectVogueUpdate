const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;

// Generic safe fetch for JSON
const safeFetchJSON = async (url: string) => {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      const text = await res.text(); // log raw response for debugging
      console.error('Fetch failed:', res.status, res.statusText, text);
      return []; // fallback to empty array
    }

    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      const text = await res.text();
      console.error('Expected JSON but got:', text);
      return []; // fallback to empty array
    }
  } catch (err) {
    console.error('Fetch error:', err);
    return []; // fallback to empty array
  }
};

// Fetch all approved products
export const fetchProducts = () => safeFetchJSON(`${API_URL}?status=approved`);

// Fetch product by ID (for details page)
export const fetchProductById = async (id: string) => {
  const data = await safeFetchJSON(`${API_URL}/${id}`);
  // data may be an array if the API returns a single object differently, handle accordingly
  return Array.isArray(data) ? data[0] || null : data;
};

// Fetch products by category (only approved)
export const fetchProductsByCategory = (category: string) =>
  safeFetchJSON(`${API_URL}/category/${category}?status=approved`);

// Fetch new arrivals (only approved)
export const fetchNewArrivals = () => safeFetchJSON(`${API_URL}/new?status=approved`);

// Fetch trending products (only approved)
export const fetchTrendingProducts = () => safeFetchJSON(`${API_URL}/trending?status=approved`);
