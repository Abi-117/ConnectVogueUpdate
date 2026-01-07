const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FetchOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
}

export const safeFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Fetch failed:", res.status, text);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return res.json();
    }

    return null;
  } catch (err) {
    console.error("Network error:", err);
    return null;
  }
};
