import { safeFetch } from './fetchClient';

export interface NavigationItem {
  _id: string;
  label: string;
  href: string;
}

export const fetchNavigation = () => safeFetch<NavigationItem[]>('/api/navigation');