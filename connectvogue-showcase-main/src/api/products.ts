// src/admin/api/products.api.ts
import { safeFetch } from './fetchClient';

const API_URL = 'http://localhost:5000/api/products';

export const fetchProducts = () => safeFetch(`${API_URL}?status=approved`);
export const fetchProductById = (id: string) => safeFetch(`${API_URL}/${id}`);
export const fetchProductsByCategory = (category: string) =>
  safeFetch(`${API_URL}/category/${category}?status=approved`);
export const fetchNewArrivals = () => safeFetch(`${API_URL}/new?status=approved`);
export const fetchTrendingProducts = () => safeFetch(`${API_URL}/trending?status=approved`);
