const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
    // Remove trailing slash from BASE_URL
    const url = `${BASE_URL.replace(/\/$/, "")}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    console.log("%c[Fetch Debug] URL:", "color: blue;", url);
    console.log("%c[Fetch Debug] Options:", "color: green;", options);

    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("%c[Fetch Error] Status:", "color: red;", res.status, text);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await res.json();
      console.log("%c[Fetch Debug] Response:", "color: purple;", data);
      return data;
    }

    console.warn("%c[Fetch Warning] Non-JSON response", "color: orange;");
    return null;
  } catch (err) {
    console.error("%c[Network Error]:", "color: red; font-weight: bold;", err);
    console.warn("Check if backend allows CORS and URL is reachable.");
    return null;
  }
};
