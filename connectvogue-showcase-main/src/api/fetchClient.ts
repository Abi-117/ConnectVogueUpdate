// src/admin/api/fetchClient.ts
export const safeFetch = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch failed:', res.status, res.statusText, text);
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      console.error('Expected JSON but got:', await res.text());
      return null;
    }
  } catch (err) {
    console.error('Network error during fetch:', err);
    return null;
  }
};
