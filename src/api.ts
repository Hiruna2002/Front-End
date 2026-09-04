// import type { Order, Product } from "./types";
//
// const PRODUCT_API = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:8080/product-service/products";
// const ORDER_API = import.meta.env.VITE_ORDER_API_URL || "http://localhost:8080/order-service/orders";
//
// async function request<T>(url: string, options?: RequestInit): Promise<T> {
//   const response = await fetch(url, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options?.headers || {}),
//     },
//     ...options,
//   });
//
//   if (!response.ok) {
//     const message = await response.text();
//     throw new Error(message || `Request failed (${response.status})`);
//   }
//
//   if (response.status === 204) return undefined as T;
//   return response.json();
// }
//
// export const productApi = {
//   getAll: () => request<Product[]>(PRODUCT_API),
//   create: (product: Omit<Product, "id">) =>
//     request<Product>(PRODUCT_API, {
//       method: "POST",
//       body: JSON.stringify(product),
//     }),
// };
//
// export const orderApi = {
//   getAll: () => request<Order[]>(ORDER_API),
//   create: (order: Omit<Order, "id">) =>
//     request<Order>(ORDER_API, {
//       method: "POST",
//       body: JSON.stringify(order),
//     }),
// };


// import type { Order, Product } from "./types";
//
// const PRODUCT_API =
//     import.meta.env.VITE_PRODUCT_API_URL ||
//     "http://localhost:8080/api/product";
//
// const ORDER_API =
//     import.meta.env.VITE_ORDER_API_URL ||
//     "http://localhost:8080/api/order";
//
// async function request<T>(
//     url: string,
//     options?: RequestInit
// ): Promise<T> {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options?.headers || {}),
//     },
//   });
//
//   if (!response.ok) {
//     const message = await response.text();
//     throw new Error(message || `Request failed (${response.status})`);
//   }
//
//   if (response.status === 204) {
//     return undefined as T;
//   }
//
//   return response.json();
// }
//
// async function multipartRequest<T>(
//     url: string,
//     formData: FormData
// ): Promise<T> {
//   const response = await fetch(url, {
//     method: "POST",
//     body: formData,
//   });
//
//   if (!response.ok) {
//     const message = await response.text();
//     throw new Error(message || `Request failed (${response.status})`);
//   }
//
//   if (response.status === 204) {
//     return undefined as T;
//   }
//
//   return response.json();
// }
//
// // export const productApi = {
// //   getAll: () => request<Product[]>(PRODUCT_API),
// //
// //   create: (
// //       name: string,
// //       description: string,
// //       price: number,
// //       image: File
// //   ) => {
// //     const formData = new FormData();
// //
// //     formData.append("name", name);
// //     formData.append("description", description);
// //     formData.append("price", price.toString());
// //     formData.append("file", image);
// //
// //     return multipartRequest<Product>(PRODUCT_API, formData);
// //   },
// // };
//
// export const productApi = {
//   getAll: () => request<Product[]>(PRODUCT_API),
//
//   create: async (
//       name: string,
//       description: string,
//       price: number,
//       image: File
//   ) => {
//     const formData = new FormData();
//
//     const productData = {
//       name,
//       description,
//       price,
//     };
//
//     const productBlob = new Blob(
//         [JSON.stringify(productData)],
//         {
//           type: "application/json",
//         }
//     );
//
//     formData.append("product", productBlob);
//     formData.append("file", image);
//
//     const response = await fetch(PRODUCT_API, {
//       method: "POST",
//       body: formData,
//     });
//
//     if (!response.ok) {
//       const message = await response.text();
//       throw new Error(
//           message || `Request failed (${response.status})`
//       );
//     }
//
//     return response.json() as Promise<Product>;
//   },
// };
//
// export const orderApi = {
//   getAll: () => request<Order[]>(ORDER_API),
//
//   create: (order: Omit<Order, "id">) =>
//       request<Order>(ORDER_API, {
//         method: "POST",
//         body: JSON.stringify(order),
//       }),
// };

import type { Order, Product } from "./types";

const PRODUCT_API =
    import.meta.env.VITE_PRODUCT_API_URL ||
    "http://localhost:8080/api/product";

const ORDER_API =
    import.meta.env.VITE_ORDER_API_URL ||
    "http://localhost:8080/api/order";

/**
 * Normal JSON requests.
 * Used for GET requests and Order POST requests.
 */
async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  // Only set JSON content type when there is a normal body.
  if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
        message || `Request failed (${response.status})`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Product API
 */
export const productApi = {
  getAll: () =>
      request<Product[]>(PRODUCT_API),

  create: async (
      name: string,
      description: string,
      price: number,
      image: File
  ): Promise<Product> => {
    const formData = new FormData();

    /*
     * Backend:
     *
     * @RequestPart("product") ProductRequest productRequest
     *
     * So this part MUST be application/json.
     */
    const productData = {
      name,
      description,
      price,
    };

    const productBlob = new Blob(
        [JSON.stringify(productData)],
        {
          type: "application/json",
        }
    );

    /*
     * Exact backend part names:
     *
     * @RequestPart("product")
     * @RequestPart("image")
     */
    formData.append("product", productBlob);
    formData.append("image", image);

    /*
     * IMPORTANT:
     * Do NOT manually set Content-Type here.
     *
     * Browser automatically creates:
     * multipart/form-data; boundary=...
     */
    const response = await fetch(PRODUCT_API, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
          message || `Request failed (${response.status})`
      );
    }

    return response.json() as Promise<Product>;
  },
};

/**
 * Order API
 */
export const orderApi = {
  getAll: () =>
      request<Order[]>(ORDER_API),

  create: (order: Omit<Order, "id">) =>
      request<Order>(ORDER_API, {
        method: "POST",
        body: JSON.stringify(order),
      }),
};