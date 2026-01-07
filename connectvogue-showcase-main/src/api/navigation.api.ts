// src/admin/api/navigation.api.ts
import { safeFetch } from './fetchClient'; // use relative path to fetchClient

export interface NavigationItem {
  _id: string;
  label: string;
  href: string;
}

// No need for hardcoded localhost URL anymore
export const fetchNavigation = () => safeFetch<NavigationItem[]>(`/api/navigation`);
