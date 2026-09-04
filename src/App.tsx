// import {type FormEvent, useEffect, useState } from "react";
// import { Boxes, PackagePlus, ShoppingCart, RefreshCw, Server, CheckCircle2, AlertCircle, ImagePlus } from "lucide-react";
// import { orderApi, productApi } from "./api";
// import type { Order, Product } from "./types";
//
// type Tab = "products" | "orders";
//
// function App() {
//   const [tab, setTab] = useState<Tab>("products");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
//
//
//   const loadData = async () => {
//     setLoading(true);
//     setMessage(null);
//     try {
//       const [productData, orderData] = await Promise.all([
//         productApi.getAll(),
//         orderApi.getAll(),
//       ]);
//       setProducts(productData || []);
//       setOrders(orderData || []);
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error instanceof Error ? error.message : "Could not connect to the backend.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   useEffect(() => {
//     loadData();
//   }, []);
//
//   return (
//     <div className="min-h-screen">
//       <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
//         <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
//               <Server size={22} />
//             </div>
//             <div>
//               <h1 className="font-semibold text-white">Microservice Store</h1>
//               <p className="text-xs text-slate-500">React + Spring Boot Microservices</p>
//             </div>
//           </div>
//
//           <button
//             onClick={loadData}
//             disabled={loading}
//             className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
//           >
//             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>
//       </header>
//
//       <main className="mx-auto max-w-6xl px-5 py-8">
//         <section className="mb-8">
//           <p className="mb-2 text-sm font-medium text-blue-400">MICROSERVICE DEMO</p>
//           <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
//             Products & Orders
//           </h2>
//           <p className="mt-2 max-w-2xl text-slate-400">
//             A small frontend for testing your Product Service, Order Service, Eureka and API Gateway.
//           </p>
//         </section>
//
//         {message && (
//           <div className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
//             message.type === "success"
//               ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
//               : "border-red-500/20 bg-red-500/10 text-red-300"
//           }`}>
//             {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//             <span>{message.text}</span>
//           </div>
//         )}
//
//         <div className="mb-6 grid grid-cols-2 gap-3">
//           <StatCard icon={<Boxes size={20} />} label="Products" value={products.length} />
//           <StatCard icon={<ShoppingCart size={20} />} label="Orders" value={orders.length} />
//         </div>
//
//         <div className="mb-6 flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
//           <TabButton active={tab === "products"} onClick={() => setTab("products")} icon={<Boxes size={17} />}>
//             Products
//           </TabButton>
//           <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={<ShoppingCart size={17} />}>
//             Orders
//           </TabButton>
//         </div>
//
//         {tab === "products" ? (
//           <ProductsSection
//             products={products}
//             onCreated={(product) => {
//               setProducts((current) => [...current, product]);
//               setMessage({ type: "success", text: "Product created successfully." });
//             }}
//             onError={(text) => setMessage({ type: "error", text })}
//           />
//         ) : (
//           <OrdersSection
//             orders={orders}
//             onCreated={(order) => {
//               setOrders((current) => [...current, order]);
//               setMessage({ type: "success", text: "Order created successfully." });
//             }}
//             onError={(text) => setMessage({ type: "error", text })}
//           />
//         )}
//       </main>
//     </div>
//   );
// }
//
// function ProductsSection({
//   products,
//   onCreated,
//   onError,
// }: {
//   products: Product[];
//   onCreated: (product: Product) => void;
//   onError: (text: string) => void;
// }) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [saving, setSaving] = useState(false);
//
//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//
//     if (!file.type.startsWith("image/")) {
//       onError("Please select an image file.");
//       return;
//     }
//
//     if (file.size > 5 * 1024 * 1024) {
//       onError("Image size must be less than 5MB.");
//       return;
//     }
//
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageUrl(String(reader.result));
//     };
//     reader.onerror = () => onError("Could not read the selected image.");
//     reader.readAsDataURL(file);
//   };
//
//   const submit = async (event: FormEvent) => {
//     event.preventDefault();
//     if (!name.trim() || !description.trim() || Number(price) <= 0) {
//       onError("Enter a valid product name, description and price.");
//       return;
//     }
//
//     setSaving(true);
//     try {
//       const product = await productApi.create({
//         name: name.trim(),
//         description: description.trim(),
//         price: Number(price),
//         imageUrl: imageUrl || undefined,
//       });
//       onCreated(product);
//       setName("");
//       setDescription("");
//       setPrice("");
//       setImageUrl("");
//     } catch (error) {
//       onError(error instanceof Error ? error.message : "Could not create product.");
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   return (
//     <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
//       <Card>
//         <SectionTitle icon={<PackagePlus size={18} />} title="Add Product" />
//         <form onSubmit={submit} className="space-y-4">
//           <Field label="Name">
//             <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Wireless Mouse" />
//           </Field>
//           <Field label="Description">
//             <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ergonomic wireless mouse" rows={3} />
//           </Field>
//           <Field label="Price">
//             <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" placeholder="2500.00" />
//           </Field>
//
//           <Field label="Product Image">
//             <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-400 transition hover:border-blue-500 hover:text-slate-300">
//               <ImagePlus size={18} className="text-blue-400" />
//               <span className="flex-1 truncate">
//                 {imageUrl ? "Image selected" : "Choose image from your computer"}
//               </span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </Field>
//
//           {imageUrl && (
//             <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
//               <img src={imageUrl} alt="Product preview" className="h-40 w-full object-cover" />
//             </div>
//           )}
//
//           <button disabled={saving} className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">
//             {saving ? "Creating..." : "Create Product"}
//           </button>
//         </form>
//       </Card>
//
//       <Card>
//         <SectionTitle icon={<Boxes size={18} />} title="Product List" />
//         {products.length === 0 ? (
//           <EmptyState text="No products found." />
//         ) : (
//           <div className="grid gap-3 sm:grid-cols-2">
//             {products.map((product) => (
//               <div key={product.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
//                 {product.imageUrl && (
//                   <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover" />
//                 )}
//                 <div className="p-4">
//                 <div className="mb-3 flex items-start justify-between gap-3">
//                   <div>
//                     <h3 className="font-semibold text-white">{product.name}</h3>
//                     <p className="mt-1 text-xs text-slate-500">ID: {product.id}</p>
//                   </div>
//                   <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-400">
//                     Rs. {Number(product.price).toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="text-sm leading-6 text-slate-400">{product.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }
//
// function OrdersSection({
//   orders,
//   onCreated,
//   onError,
// }: {
//   orders: Order[];
//   onCreated: (order: Order) => void;
//   onError: (text: string) => void;
// }) {
//   const [skuCode, setSkuCode] = useState("");
//   const [price, setPrice] = useState("");
//   const [qty, setQty] = useState("1");
//   const [saving, setSaving] = useState(false);
//
//   const submit = async (event: FormEvent) => {
//     event.preventDefault();
//     if (!skuCode.trim() || Number(price) <= 0 || Number(qty) <= 0) {
//       onError("Enter a valid SKU code, price and quantity.");
//       return;
//     }
//
//     setSaving(true);
//     try {
//       const order = await orderApi.create({
//         skuCode: skuCode.trim(),
//         price: Number(price),
//         qty: Number(qty),
//       });
//       onCreated(order);
//       setSkuCode("");
//       setPrice("");
//       setQty("1");
//     } catch (error) {
//       onError(error instanceof Error ? error.message : "Could not create order.");
//     } finally {
//       setSaving(false);
//     }
//   };
//
//   return (
//     <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
//       <Card>
//         <SectionTitle icon={<ShoppingCart size={18} />} title="Create Order" />
//         <form onSubmit={submit} className="space-y-4">
//           <Field label="SKU Code">
//             <input value={skuCode} onChange={(e) => setSkuCode(e.target.value)} placeholder="SKU-1001" />
//           </Field>
//           <Field label="Price">
//             <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" placeholder="2500.00" />
//           </Field>
//           <Field label="Quantity">
//             <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" min="1" step="1" />
//           </Field>
//           <div className="rounded-lg bg-slate-800/60 p-3 text-sm text-slate-400">
//             Total: <span className="font-semibold text-white">Rs. {(Number(price || 0) * Number(qty || 0)).toLocaleString()}</span>
//           </div>
//           <button disabled={saving} className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50">
//             {saving ? "Creating..." : "Create Order"}
//           </button>
//         </form>
//       </Card>
//
//       <Card>
//         <SectionTitle icon={<ShoppingCart size={18} />} title="Order List" />
//         {orders.length === 0 ? (
//           <EmptyState text="No orders found." />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[560px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
//                   <th className="px-3 py-3">ID</th>
//                   <th className="px-3 py-3">SKU</th>
//                   <th className="px-3 py-3">Price</th>
//                   <th className="px-3 py-3">Qty</th>
//                   <th className="px-3 py-3">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id} className="border-b border-slate-900">
//                     <td className="px-3 py-4 text-slate-400">{order.id}</td>
//                     <td className="px-3 py-4 font-medium text-white">{order.skuCode}</td>
//                     <td className="px-3 py-4 text-slate-300">Rs. {Number(order.price).toLocaleString()}</td>
//                     <td className="px-3 py-4 text-slate-300">{order.qty}</td>
//                     <td className="px-3 py-4 font-semibold text-emerald-400">
//                       Rs. {(Number(order.price) * Number(order.qty)).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }
//
// function Card({ children }: { children: React.ReactNode }) {
//   return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">{children}</div>;
// }
//
// function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
//   return (
//     <div className="mb-5 flex items-center gap-2 text-white">
//       <span className="text-blue-400">{icon}</span>
//       <h2 className="font-semibold">{title}</h2>
//     </div>
//   );
// }
//
// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <label className="block">
//       <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
//       <span className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-700 [&_input]:bg-slate-950 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white [&_input]:outline-none [&_input]:transition [&_input]:focus:border-blue-500 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-slate-700 [&_textarea]:bg-slate-950 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:text-white [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:focus:border-blue-500">
//         {children}
//       </span>
//     </label>
//   );
// }
//
// function EmptyState({ text }: { text: string }) {
//   return <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-sm text-slate-500">{text}</div>;
// }
//
// function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
//   return (
//     <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
//       <div className="mb-2 flex items-center gap-2 text-slate-400">
//         {icon}
//         <span className="text-sm">{label}</span>
//       </div>
//       <p className="text-2xl font-bold text-white">{value}</p>
//     </div>
//   );
// }
//
// function TabButton({
//   active,
//   onClick,
//   icon,
//   children,
// }: {
//   active: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//         active ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
//       }`}
//     >
//       {icon}
//       {children}
//     </button>
//   );
// }
//
// export default App;

// import {
//     type ChangeEvent,
//     type FormEvent,
//     type ReactNode,
//     useEffect,
//     useState,
// } from "react";
//
// import {
//     Boxes,
//     PackagePlus,
//     ShoppingCart,
//     RefreshCw,
//     Server,
//     CheckCircle2,
//     AlertCircle,
//     ImagePlus,
// } from "lucide-react";
//
// import { orderApi, productApi } from "./api";
// import type { Order, Product } from "./types";
//
// type Tab = "products" | "orders";
//
// function App() {
//     const [tab, setTab] = useState<Tab>("products");
//     const [products, setProducts] = useState<Product[]>([]);
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(false);
//
//     const [message, setMessage] = useState<{
//         type: "success" | "error";
//         text: string;
//     } | null>(null);
//
//     const loadData = async () => {
//         setLoading(true);
//         setMessage(null);
//
//         try {
//             const [productData, orderData] = await Promise.all([
//                 productApi.getAll(),
//                 orderApi.getAll(),
//             ]);
//
//             setProducts(productData || []);
//             setOrders(orderData || []);
//         } catch (error) {
//             setMessage({
//                 type: "error",
//                 text:
//                     error instanceof Error
//                         ? error.message
//                         : "Could not connect to the backend.",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         loadData();
//     }, []);
//
//     return (
//         <div className="min-h-screen">
//             <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
//                 <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
//                     <div className="flex items-center gap-3">
//                         <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
//                             <Server size={22} />
//                         </div>
//
//                         <div>
//                             <h1 className="font-semibold text-white">
//                                 Microservice Store
//                             </h1>
//
//                             <p className="text-xs text-slate-500">
//                                 React + Spring Boot Microservices
//                             </p>
//                         </div>
//                     </div>
//
//                     <button
//                         onClick={loadData}
//                         disabled={loading}
//                         className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
//                     >
//                         <RefreshCw
//                             size={16}
//                             className={loading ? "animate-spin" : ""}
//                         />
//                         Refresh
//                     </button>
//                 </div>
//             </header>
//
//             <main className="mx-auto max-w-6xl px-5 py-8">
//                 <section className="mb-8">
//                     <p className="mb-2 text-sm font-medium text-blue-400">
//                         MICROSERVICE DEMO
//                     </p>
//
//                     <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
//                         Products & Orders
//                     </h2>
//
//                     <p className="mt-2 max-w-2xl text-slate-400">
//                         A small frontend for testing your Product Service,
//                         Order Service, Eureka and API Gateway.
//                     </p>
//                 </section>
//
//                 {message && (
//                     <div
//                         className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
//                             message.type === "success"
//                                 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
//                                 : "border-red-500/20 bg-red-500/10 text-red-300"
//                         }`}
//                     >
//                         {message.type === "success" ? (
//                             <CheckCircle2 size={18} />
//                         ) : (
//                             <AlertCircle size={18} />
//                         )}
//
//                         <span>{message.text}</span>
//                     </div>
//                 )}
//
//                 <div className="mb-6 grid grid-cols-2 gap-3">
//                     <StatCard
//                         icon={<Boxes size={20} />}
//                         label="Products"
//                         value={products.length}
//                     />
//
//                     <StatCard
//                         icon={<ShoppingCart size={20} />}
//                         label="Orders"
//                         value={orders.length}
//                     />
//                 </div>
//
//                 <div className="mb-6 flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
//                     <TabButton
//                         active={tab === "products"}
//                         onClick={() => setTab("products")}
//                         icon={<Boxes size={17} />}
//                     >
//                         Products
//                     </TabButton>
//
//                     <TabButton
//                         active={tab === "orders"}
//                         onClick={() => setTab("orders")}
//                         icon={<ShoppingCart size={17} />}
//                     >
//                         Orders
//                     </TabButton>
//                 </div>
//
//                 {tab === "products" ? (
//                     <ProductsSection
//                         products={products}
//                         onCreated={(product) => {
//                             setProducts((current) => [...current, product]);
//
//                             setMessage({
//                                 type: "success",
//                                 text: "Product created successfully.",
//                             });
//                         }}
//                         onError={(text) =>
//                             setMessage({
//                                 type: "error",
//                                 text,
//                             })
//                         }
//                     />
//                 ) : (
//                     <OrdersSection
//                         orders={orders}
//                         onCreated={(order) => {
//                             setOrders((current) => [...current, order]);
//
//                             setMessage({
//                                 type: "success",
//                                 text: "Order created successfully.",
//                             });
//                         }}
//                         onError={(text) =>
//                             setMessage({
//                                 type: "error",
//                                 text,
//                             })
//                         }
//                     />
//                 )}
//             </main>
//         </div>
//     );
// }
//
// /* =========================================================
//    PRODUCTS
//    ========================================================= */
//
// function ProductsSection({
//                              products,
//                              onCreated,
//                              onError,
//                          }: {
//     products: Product[];
//     onCreated: (product: Product) => void;
//     onError: (text: string) => void;
// }) {
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [price, setPrice] = useState("");
//
//     // Actual file that will be sent to Spring Boot
//     const [imageFile, setImageFile] = useState<File | null>(null);
//
//     // Only used for browser preview
//     const [imagePreview, setImagePreview] = useState("");
//
//     const [saving, setSaving] = useState(false);
//
//     useEffect(() => {
//         return () => {
//             if (imagePreview) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);
//
//     const handleImageChange = (
//         event: ChangeEvent<HTMLInputElement>
//     ) => {
//         const file = event.target.files?.[0];
//
//         if (!file) {
//             return;
//         }
//
//         if (!file.type.startsWith("image/")) {
//             onError("Please select an image file.");
//             event.target.value = "";
//             return;
//         }
//
//         if (file.size > 5 * 1024 * 1024) {
//             onError("Image size must be less than 5MB.");
//             event.target.value = "";
//             return;
//         }
//
//         setImageFile(file);
//
//         const previewUrl = URL.createObjectURL(file);
//         setImagePreview(previewUrl);
//     };
//
//     const submit = async (event: FormEvent) => {
//         event.preventDefault();
//
//         if (
//             !name.trim() ||
//             !description.trim() ||
//             Number(price) <= 0
//         ) {
//             onError(
//                 "Enter a valid product name, description and price."
//             );
//             return;
//         }
//
//         if (!imageFile) {
//             onError("Please select a product image.");
//             return;
//         }
//
//         setSaving(true);
//
//         try {
//             const product = await productApi.create(
//                 name.trim(),
//                 description.trim(),
//                 Number(price),
//                 imageFile
//             );
//
//             onCreated(product);
//
//             setName("");
//             setDescription("");
//             setPrice("");
//             setImageFile(null);
//             setImagePreview("");
//         } catch (error) {
//             onError(
//                 error instanceof Error
//                     ? error.message
//                     : "Could not create product."
//             );
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
//             <Card>
//                 <SectionTitle
//                     icon={<PackagePlus size={18} />}
//                     title="Add Product"
//                 />
//
//                 <form onSubmit={submit} className="space-y-4">
//                     <Field label="Name">
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="Wireless Mouse"
//                         />
//                     </Field>
//
//                     <Field label="Description">
//             <textarea
//                 value={description}
//                 onChange={(e) =>
//                     setDescription(e.target.value)
//                 }
//                 placeholder="Ergonomic wireless mouse"
//                 rows={3}
//             />
//                     </Field>
//
//                     <Field label="Price">
//                         <input
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             type="number"
//                             min="0"
//                             step="0.01"
//                             placeholder="2500.00"
//                         />
//                     </Field>
//
//                     <Field label="Product Image">
//                         <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-400 transition hover:border-blue-500 hover:text-slate-300">
//                             <ImagePlus
//                                 size={18}
//                                 className="text-blue-400"
//                             />
//
//                             <span className="flex-1 truncate">
//                 {imageFile
//                     ? imageFile.name
//                     : "Choose image from your computer"}
//               </span>
//
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </label>
//                     </Field>
//
//                     {imagePreview && (
//                         <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
//                             <img
//                                 src={imagePreview}
//                                 alt="Product preview"
//                                 className="h-40 w-full object-cover"
//                             />
//                         </div>
//                     )}
//
//                     <button
//                         type="submit"
//                         disabled={saving}
//                         className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
//                     >
//                         {saving ? "Creating..." : "Create Product"}
//                     </button>
//                 </form>
//             </Card>
//
//             <Card>
//                 <SectionTitle
//                     icon={<Boxes size={18} />}
//                     title="Product List"
//                 />
//
//                 {products.length === 0 ? (
//                     <EmptyState text="No products found." />
//                 ) : (
//                     <div className="grid gap-3 sm:grid-cols-2">
//                         {products.map((product) => (
//                             <div
//                                 key={product.id}
//                                 className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
//                             >
//                                 {product.imageUrl && (
//                                     <img
//                                         src={product.imageUrl}
//                                         alt={product.name}
//                                         className="h-40 w-full object-cover"
//                                     />
//                                 )}
//
//                                 <div className="p-4">
//                                     <div className="mb-3 flex items-start justify-between gap-3">
//                                         <div>
//                                             <h3 className="font-semibold text-white">
//                                                 {product.name}
//                                             </h3>
//
//                                             <p className="mt-1 text-xs text-slate-500">
//                                                 ID: {product.id}
//                                             </p>
//                                         </div>
//
//                                         <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-400">
//                       Rs.{" "}
//                                             {Number(
//                                                 product.price
//                                             ).toLocaleString()}
//                     </span>
//                                     </div>
//
//                                     <p className="text-sm leading-6 text-slate-400">
//                                         {product.description}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </Card>
//         </div>
//     );
// }
//
// /* =========================================================
//    ORDERS
//    ========================================================= */
//
// function OrdersSection({
//                            orders,
//                            onCreated,
//                            onError,
//                        }: {
//     orders: Order[];
//     onCreated: (order: Order) => void;
//     onError: (text: string) => void;
// }) {
//     const [skuCode, setSkuCode] = useState("");
//     const [price, setPrice] = useState("");
//     const [qty, setQty] = useState("1");
//     const [saving, setSaving] = useState(false);
//
//     const submit = async (event: FormEvent) => {
//         event.preventDefault();
//
//         if (
//             !skuCode.trim() ||
//             Number(price) <= 0 ||
//             Number(qty) <= 0
//         ) {
//             onError(
//                 "Enter a valid SKU code, price and quantity."
//             );
//             return;
//         }
//
//         setSaving(true);
//
//         try {
//             const order = await orderApi.create({
//                 skuCode: skuCode.trim(),
//                 price: Number(price),
//                 qty: Number(qty),
//             });
//
//             onCreated(order);
//
//             setSkuCode("");
//             setPrice("");
//             setQty("1");
//         } catch (error) {
//             onError(
//                 error instanceof Error
//                     ? error.message
//                     : "Could not create order."
//             );
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
//             <Card>
//                 <SectionTitle
//                     icon={<ShoppingCart size={18} />}
//                     title="Create Order"
//                 />
//
//                 <form onSubmit={submit} className="space-y-4">
//                     <Field label="SKU Code">
//                         <input
//                             value={skuCode}
//                             onChange={(e) => setSkuCode(e.target.value)}
//                             placeholder="SKU-1001"
//                         />
//                     </Field>
//
//                     <Field label="Price">
//                         <input
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             type="number"
//                             min="0"
//                             step="0.01"
//                             placeholder="2500.00"
//                         />
//                     </Field>
//
//                     <Field label="Quantity">
//                         <input
//                             value={qty}
//                             onChange={(e) => setQty(e.target.value)}
//                             type="number"
//                             min="1"
//                             step="1"
//                         />
//                     </Field>
//
//                     <div className="rounded-lg bg-slate-800/60 p-3 text-sm text-slate-400">
//                         Total:{" "}
//                         <span className="font-semibold text-white">
//               Rs.{" "}
//                             {(
//                                 Number(price || 0) * Number(qty || 0)
//                             ).toLocaleString()}
//             </span>
//                     </div>
//
//                     <button
//                         type="submit"
//                         disabled={saving}
//                         className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
//                     >
//                         {saving ? "Creating..." : "Create Order"}
//                     </button>
//                 </form>
//             </Card>
//
//             <Card>
//                 <SectionTitle
//                     icon={<ShoppingCart size={18} />}
//                     title="Order List"
//                 />
//
//                 {orders.length === 0 ? (
//                     <EmptyState text="No orders found." />
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="w-full min-w-[560px] text-left text-sm">
//                             <thead>
//                             <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
//                                 <th className="px-3 py-3">ID</th>
//                                 <th className="px-3 py-3">SKU</th>
//                                 <th className="px-3 py-3">
//                                     Price
//                                 </th>
//                                 <th className="px-3 py-3">Qty</th>
//                                 <th className="px-3 py-3">
//                                     Total
//                                 </th>
//                             </tr>
//                             </thead>
//
//                             <tbody>
//                             {orders.map((order) => (
//                                 <tr
//                                     key={order.id}
//                                     className="border-b border-slate-900"
//                                 >
//                                     <td className="px-3 py-4 text-slate-400">
//                                         {order.id}
//                                     </td>
//
//                                     <td className="px-3 py-4 font-medium text-white">
//                                         {order.skuCode}
//                                     </td>
//
//                                     <td className="px-3 py-4 text-slate-300">
//                                         Rs.{" "}
//                                         {Number(
//                                             order.price
//                                         ).toLocaleString()}
//                                     </td>
//
//                                     <td className="px-3 py-4 text-slate-300">
//                                         {order.qty}
//                                     </td>
//
//                                     <td className="px-3 py-4 font-semibold text-emerald-400">
//                                         Rs.{" "}
//                                         {(
//                                             Number(order.price) *
//                                             Number(order.qty)
//                                         ).toLocaleString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </Card>
//         </div>
//     );
// }
//
// /* =========================================================
//    SHARED COMPONENTS
//    ========================================================= */
//
// function Card({
//                   children,
//               }: {
//     children: ReactNode;
// }) {
//     return (
//         <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
//             {children}
//         </div>
//     );
// }
//
// function SectionTitle({
//                           icon,
//                           title,
//                       }: {
//     icon: ReactNode;
//     title: string;
// }) {
//     return (
//         <div className="mb-5 flex items-center gap-2 text-white">
//       <span className="text-blue-400">
//         {icon}
//       </span>
//
//             <h2 className="font-semibold">
//                 {title}
//             </h2>
//         </div>
//     );
// }
//
// function Field({
//                    label,
//                    children,
//                }: {
//     label: string;
//     children: ReactNode;
// }) {
//     return (
//         <label className="block">
//       <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
//         {label}
//       </span>
//
//             <span className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-700 [&_input]:bg-slate-950 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white [&_input]:outline-none [&_input]:transition [&_input]:focus:border-blue-500 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-slate-700 [&_textarea]:bg-slate-950 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:text-white [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:focus:border-blue-500">
//         {children}
//       </span>
//         </label>
//     );
// }
//
// function EmptyState({
//                         text,
//                     }: {
//     text: string;
// }) {
//     return (
//         <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-sm text-slate-500">
//             {text}
//         </div>
//     );
// }
//
// function StatCard({
//                       icon,
//                       label,
//                       value,
//                   }: {
//     icon: ReactNode;
//     label: string;
//     value: number;
// }) {
//     return (
//         <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
//             <div className="mb-2 flex items-center gap-2 text-slate-400">
//                 {icon}
//                 <span className="text-sm">
//           {label}
//         </span>
//             </div>
//
//             <p className="text-2xl font-bold text-white">
//                 {value}
//             </p>
//         </div>
//     );
// }
//
// function TabButton({
//                        active,
//                        onClick,
//                        icon,
//                        children,
//                    }: {
//     active: boolean;
//     onClick: () => void;
//     icon: ReactNode;
//     children: ReactNode;
// }) {
//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
//                 active
//                     ? "bg-slate-800 text-white"
//                     : "text-slate-500 hover:text-slate-300"
//             }`}
//         >
//             {icon}
//             {children}
//         </button>
//     );
// }
//
// export default App;

import {
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
    useEffect,
    useState,
} from "react";

import {
    Boxes,
    PackagePlus,
    ShoppingCart,
    RefreshCw,
    Server,
    CheckCircle2,
    AlertCircle,
    ImagePlus,
} from "lucide-react";

import { orderApi, productApi } from "./api";
import type { Order, Product } from "./types";

type Tab = "products" | "orders";

function App() {
    const [tab, setTab] = useState<Tab>("products");

    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const loadData = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const [productData, orderData] =
                await Promise.all([
                    productApi.getAll(),
                    orderApi.getAll(),
                ]);

            setProducts(productData || []);
            setOrders(orderData || []);
        } catch (error) {
            setMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "Could not connect to the backend.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen">
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-500/15 p-2 text-blue-400">
                            <Server size={22} />
                        </div>

                        <div>
                            <h1 className="font-semibold text-white">
                                Microservice Store
                            </h1>

                            <p className="text-xs text-slate-500">
                                React + Spring Boot Microservices
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                loading ? "animate-spin" : ""
                            }
                        />

                        Refresh
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-8">
                <section className="mb-8">
                    <p className="mb-2 text-sm font-medium text-blue-400">
                        MICROSERVICE DEMO
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Products & Orders
                    </h2>

                    <p className="mt-2 max-w-2xl text-slate-400">
                        A small frontend for testing your
                        Product Service, Order Service,
                        Eureka and API Gateway.
                    </p>
                </section>

                {message && (
                    <div
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                            message.type === "success"
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                : "border-red-500/20 bg-red-500/10 text-red-300"
                        }`}
                    >
                        {message.type === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}

                        <span>{message.text}</span>
                    </div>
                )}

                <div className="mb-6 grid grid-cols-2 gap-3">
                    <StatCard
                        icon={<Boxes size={20} />}
                        label="Products"
                        value={products.length}
                    />

                    <StatCard
                        icon={<ShoppingCart size={20} />}
                        label="Orders"
                        value={orders.length}
                    />
                </div>

                <div className="mb-6 flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
                    <TabButton
                        active={tab === "products"}
                        onClick={() =>
                            setTab("products")
                        }
                        icon={<Boxes size={17} />}
                    >
                        Products
                    </TabButton>

                    <TabButton
                        active={tab === "orders"}
                        onClick={() =>
                            setTab("orders")
                        }
                        icon={
                            <ShoppingCart size={17} />
                        }
                    >
                        Orders
                    </TabButton>
                </div>

                {tab === "products" ? (
                    <ProductsSection
                        products={products}
                        onCreated={(product) => {
                            setProducts((current) => [
                                ...current,
                                product,
                            ]);

                            setMessage({
                                type: "success",
                                text:
                                    "Product created successfully.",
                            });
                        }}
                        onError={(text) =>
                            setMessage({
                                type: "error",
                                text,
                            })
                        }
                    />
                ) : (
                    <OrdersSection
                        orders={orders}
                        onCreated={(order) => {
                            setOrders((current) => [
                                ...current,
                                order,
                            ]);

                            setMessage({
                                type: "success",
                                text:
                                    "Order created successfully.",
                            });
                        }}
                        onError={(text) =>
                            setMessage({
                                type: "error",
                                text,
                            })
                        }
                    />
                )}
            </main>
        </div>
    );
}

/* ======================================================
   PRODUCTS
   ====================================================== */

function ProductsSection({
                             products,
                             onCreated,
                             onError,
                         }: {
    products: Product[];
    onCreated: (product: Product) => void;
    onError: (text: string) => void;
}) {
    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] =
        useState("");

    /*
     * Actual file that gets uploaded
     * to Spring Boot / GCP Cloud Storage.
     */
    const [imageFile, setImageFile] =
        useState<File | null>(null);

    /*
     * Local browser preview only.
     * This URL is NOT sent to backend.
     */
    const [imagePreview, setImagePreview] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    /*
     * Clean up browser-created preview URL.
     */
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };
    }, [imagePreview]);

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith("image/")
        ) {
            onError(
                "Please select an image file."
            );

            event.target.value = "";
            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            onError(
                "Image size must be less than 5MB."
            );

            event.target.value = "";
            return;
        }

        setImageFile(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    const submit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        if (
            !name.trim() ||
            !description.trim() ||
            Number(price) <= 0
        ) {
            onError(
                "Enter a valid product name, description and price."
            );

            return;
        }

        if (!imageFile) {
            onError(
                "Please select a product image."
            );

            return;
        }

        setSaving(true);

        try {
            /*
             * api.ts will create:
             *
             * product -> application/json
             * image   -> actual File
             */
            const product =
                await productApi.create(
                    name.trim(),
                    description.trim(),
                    Number(price),
                    imageFile
                );

            onCreated(product);

            setName("");
            setDescription("");
            setPrice("");
            setImageFile(null);
            setImagePreview("");
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Could not create product."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <Card>
                <SectionTitle
                    icon={
                        <PackagePlus size={18} />
                    }
                    title="Add Product"
                />

                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    <Field label="Name">
                        <input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Wireless Mouse"
                        />
                    </Field>

                    <Field label="Description">
            <textarea
                value={description}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
                placeholder="Ergonomic wireless mouse"
                rows={3}
            />
                    </Field>

                    <Field label="Price">
                        <input
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="2500.00"
                        />
                    </Field>

                    <Field label="Product Image">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-400 transition hover:border-blue-500 hover:text-slate-300">
                            <ImagePlus
                                size={18}
                                className="text-blue-400"
                            />

                            <span className="flex-1 truncate">
                {imageFile
                    ? imageFile.name
                    : "Choose image from your computer"}
              </span>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                                className="hidden"
                            />
                        </label>
                    </Field>

                    {imagePreview && (
                        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                            <img
                                src={imagePreview}
                                alt="Product preview"
                                className="h-40 w-full object-cover"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
                    >
                        {saving
                            ? "Creating..."
                            : "Create Product"}
                    </button>
                </form>
            </Card>

            <Card>
                <SectionTitle
                    icon={<Boxes size={18} />}
                    title="Product List"
                />

                {products.length === 0 ? (
                    <EmptyState text="No products found." />
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {products.map(
                            (product) => (
                                <div
                                    key={product.id}
                                    className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
                                >
                                    {product.imageUrl && (
                                        <img
                                            src={
                                                product.imageUrl
                                            }
                                            alt={
                                                product.name
                                            }
                                            className="h-40 w-full object-cover"
                                        />
                                    )}

                                    <div className="p-4">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-white">
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    ID:{" "}
                                                    {
                                                        product.id
                                                    }
                                                </p>
                                            </div>

                                            <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-400">
                        Rs.{" "}
                                                {Number(
                                                    product.price
                                                ).toLocaleString()}
                      </span>
                                        </div>

                                        <p className="text-sm leading-6 text-slate-400">
                                            {
                                                product.description
                                            }
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}

/* ======================================================
   ORDERS
   ====================================================== */

function OrdersSection({
                           orders,
                           onCreated,
                           onError,
                       }: {
    orders: Order[];
    onCreated: (order: Order) => void;
    onError: (text: string) => void;
}) {
    const [skuCode, setSkuCode] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [qty, setQty] =
        useState("1");

    const [saving, setSaving] =
        useState(false);

    const submit = async (
        event: FormEvent
    ) => {
        event.preventDefault();

        if (
            !skuCode.trim() ||
            Number(price) <= 0 ||
            Number(qty) <= 0
        ) {
            onError(
                "Enter a valid SKU code, price and quantity."
            );

            return;
        }

        setSaving(true);

        try {
            const order =
                await orderApi.create({
                    skuCode:
                        skuCode.trim(),
                    price: Number(price),
                    qty: Number(qty),
                });

            onCreated(order);

            setSkuCode("");
            setPrice("");
            setQty("1");
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Could not create order."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <Card>
                <SectionTitle
                    icon={
                        <ShoppingCart
                            size={18}
                        />
                    }
                    title="Create Order"
                />

                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    <Field label="SKU Code">
                        <input
                            value={skuCode}
                            onChange={(e) =>
                                setSkuCode(
                                    e.target.value
                                )
                            }
                            placeholder="SKU-1001"
                        />
                    </Field>

                    <Field label="Price">
                        <input
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="2500.00"
                        />
                    </Field>

                    <Field label="Quantity">
                        <input
                            value={qty}
                            onChange={(e) =>
                                setQty(
                                    e.target.value
                                )
                            }
                            type="number"
                            min="1"
                            step="1"
                        />
                    </Field>

                    <div className="rounded-lg bg-slate-800/60 p-3 text-sm text-slate-400">
                        Total:{" "}
                        <span className="font-semibold text-white">
              Rs.{" "}
                            {(
                                Number(price || 0) *
                                Number(qty || 0)
                            ).toLocaleString()}
            </span>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
                    >
                        {saving
                            ? "Creating..."
                            : "Create Order"}
                    </button>
                </form>
            </Card>

            <Card>
                <SectionTitle
                    icon={
                        <ShoppingCart
                            size={18}
                        />
                    }
                    title="Order List"
                />

                {orders.length === 0 ? (
                    <EmptyState text="No orders found." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                            <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-3 py-3">
                                    ID
                                </th>

                                <th className="px-3 py-3">
                                    SKU
                                </th>

                                <th className="px-3 py-3">
                                    Price
                                </th>

                                <th className="px-3 py-3">
                                    Qty
                                </th>

                                <th className="px-3 py-3">
                                    Total
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {orders.map(
                                (order) => (
                                    <tr
                                        key={
                                            order.id
                                        }
                                        className="border-b border-slate-900"
                                    >
                                        <td className="px-3 py-4 text-slate-400">
                                            {
                                                order.id
                                            }
                                        </td>

                                        <td className="px-3 py-4 font-medium text-white">
                                            {
                                                order.skuCode
                                            }
                                        </td>

                                        <td className="px-3 py-4 text-slate-300">
                                            Rs.{" "}
                                            {Number(
                                                order.price
                                            ).toLocaleString()}
                                        </td>

                                        <td className="px-3 py-4 text-slate-300">
                                            {
                                                order.qty
                                            }
                                        </td>

                                        <td className="px-3 py-4 font-semibold text-emerald-400">
                                            Rs.{" "}
                                            {(
                                                Number(
                                                    order.price
                                                ) *
                                                Number(
                                                    order.qty
                                                )
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}

/* ======================================================
   SHARED COMPONENTS
   ====================================================== */

function Card({
                  children,
              }: {
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
            {children}
        </div>
    );
}

function SectionTitle({
                          icon,
                          title,
                      }: {
    icon: ReactNode;
    title: string;
}) {
    return (
        <div className="mb-5 flex items-center gap-2 text-white">
      <span className="text-blue-400">
        {icon}
      </span>

            <h2 className="font-semibold">
                {title}
            </h2>
        </div>
    );
}

function Field({
                   label,
                   children,
               }: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>

            <span className="[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-700 [&_input]:bg-slate-950 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-white [&_input]:outline-none [&_input]:transition [&_input]:focus:border-blue-500 [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-slate-700 [&_textarea]:bg-slate-950 [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-sm [&_textarea]:text-white [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:focus:border-blue-500">
        {children}
      </span>
        </label>
    );
}

function EmptyState({
                        text,
                    }: {
    text: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-sm text-slate-500">
            {text}
        </div>
    );
}

function StatCard({
                      icon,
                      label,
                      value,
                  }: {
    icon: ReactNode;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
                {icon}

                <span className="text-sm">
          {label}
        </span>
            </div>

            <p className="text-2xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}

function TabButton({
                       active,
                       onClick,
                       icon,
                       children,
                   }: {
    active: boolean;
    onClick: () => void;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-300"
            }`}
        >
            {icon}
            {children}
        </button>
    );
}

export default App;