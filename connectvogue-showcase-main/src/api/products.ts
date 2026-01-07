// src/admin/api/products.api.ts
import { safeFetch } from './fetchClient';

export const fetchProducts = () => safeFetch(`/api/products?status=approved`);
export const fetchProductById = (id: string) => safeFetch(`/api/products/${id}`);
export const fetchProductsByCategory = (category: string) =>
  safeFetch(`/api/products/category/${category}?status=approved`);
export const fetchNewArrivals = () => safeFetch(`/api/products/new?status=approved`);
export const fetchTrendingProducts = () => safeFetch(`/api/products/trending?status=approved`);
