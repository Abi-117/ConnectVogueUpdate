// src/api/fetchClient.ts
export const safeFetch = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);

    // Check response status
    if (!res.ok) {
      const text = await res.text();
      console.error('Fetch failed:', res.status, res.statusText, text);
      return null;
    }

    // Check if content-type is JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    } else {
      const text = await res.text();
      console.error('Expected JSON but got:', text);
      return null;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    return null;
  }
};
