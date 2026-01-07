// src/api/navigation.ts
import { safeFetch } from '../api/fetchClient';

export interface NavigationItem {
  _id: string;
  label: string;
  href: string;
}

const API_URL = "http://localhost:5000/api/navigation";

export const fetchNavigation = (): Promise<NavigationItem[] | null> =>
  safeFetch<NavigationItem[]>(API_URL);
