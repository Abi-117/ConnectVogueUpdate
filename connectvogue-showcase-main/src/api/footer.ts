// src/api/footer.ts
import { safeFetch } from './fetchClient';

export const fetchFooter = () =>
  safeFetch('/api/footer');
