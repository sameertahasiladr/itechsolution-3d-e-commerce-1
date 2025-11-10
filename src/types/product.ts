export type ProductCategory = 'laptops' | 'desktops' | 'accessories' | 'printers' | 'cctv';
export type ProductCondition = 'new' | 'refurbished';

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string;
  displayOrder: number;
  isPrimary: boolean;
  width: number;
  height: number;
  format: string;
  createdAt: string;
}

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  image: string;
  stock: number;
  featured?: boolean;
  specifications?: string[];
  images?: ProductImage[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  createdAt: string;
}

export interface Order {
  id: string | number;
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
  updatedAt: string;
}