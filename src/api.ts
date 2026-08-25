import type { Order, Product } from "./types";

const PRODUCT_API = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:8080/product-service/products";
const ORDER_API = import.meta.env.VITE_ORDER_API_URL || "http://localhost:8080/order-service/orders";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const productApi = {
  getAll: () => request<Product[]>(PRODUCT_API),
  create: (product: Omit<Product, "id">) =>
    request<Product>(PRODUCT_API, {
      method: "POST",
      body: JSON.stringify(product),
    }),
};

export const orderApi = {
  getAll: () => request<Order[]>(ORDER_API),
  create: (order: Omit<Order, "id">) =>
    request<Order>(ORDER_API, {
      method: "POST",
      body: JSON.stringify(order),
    }),
};