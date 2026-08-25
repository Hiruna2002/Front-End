export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id: number | string;
  skuCode: string;
  price: number;
  qty: number;
}