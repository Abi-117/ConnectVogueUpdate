const BASE_URL = "https://connectvogue.onrender.com";

interface FetchOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
}

export const safeFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${BASE_URL.replace(/\/$/, "")}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    body: isFormData
      ? options.body
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
};
