// src/admin/api/footer.api.ts
import { safeFetch } from './fetchClient';

const API_URL = 'http://localhost:5000/api/footer';

export const fetchFooter = () => safeFetch(API_URL);
