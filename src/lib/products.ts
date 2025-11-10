import { Product } from '@/types/product';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Dell XPS 15',
    description: 'Powerful laptop with Intel Core i7, 16GB RAM, 512GB SSD',
    price: 85000,
    category: 'laptops',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    stock: 10,
    featured: true,
    specifications: ['Intel Core i7', '16GB RAM', '512GB SSD', '15.6" Display']
  },
  {
    id: '2',
    name: 'HP Pavilion Desktop',
    description: 'Complete desktop setup with monitor, keyboard, and mouse',
    price: 55000,
    category: 'desktops',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=500&fit=crop',
    stock: 8,
    featured: true,
    specifications: ['Intel Core i5', '8GB RAM', '1TB HDD', '21.5" Monitor']
  },
  {
    id: '3',
    name: 'Logitech MX Master 3',
    description: 'Premium wireless mouse for productivity',
    price: 8500,
    category: 'accessories',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
    stock: 25,
    featured: false,
    specifications: ['Wireless', 'Rechargeable', 'Ergonomic Design']
  },
  {
    id: '4',
    name: 'Canon Pixma Printer',
    description: 'All-in-one printer with scanning and copying',
    price: 12000,
    category: 'printers',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop',
    stock: 15,
    featured: false,
    specifications: ['Color Printing', 'WiFi Enabled', 'Scanner', 'Copier']
  },
  {
    id: '5',
    name: 'Hikvision CCTV Camera',
    description: '4MP outdoor security camera with night vision',
    price: 6500,
    category: 'cctv',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&h=500&fit=crop',
    stock: 30,
    featured: true,
    specifications: ['4MP Resolution', 'Night Vision', 'Weatherproof', 'Cloud Storage']
  },
  {
    id: '6',
    name: 'Lenovo ThinkPad T480',
    description: 'Reliable refurbished business laptop',
    price: 35000,
    category: 'laptops',
    condition: 'refurbished',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
    stock: 5,
    featured: false,
    specifications: ['Intel Core i5', '8GB RAM', '256GB SSD', '14" Display']
  },
  {
    id: '7',
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming keyboard with RGB backlighting',
    price: 4500,
    category: 'accessories',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
    stock: 20,
    featured: false,
    specifications: ['Mechanical Switches', 'RGB Lighting', 'USB Type-C']
  },
  {
    id: '8',
    name: 'Dell OptiPlex Desktop',
    description: 'Refurbished desktop perfect for office work',
    price: 28000,
    category: 'desktops',
    condition: 'refurbished',
    image: 'https://images.unsplash.com/photo-1547082661-6e12f6b1029f?w=500&h=500&fit=crop',
    stock: 6,
    featured: false,
    specifications: ['Intel Core i3', '4GB RAM', '500GB HDD', 'Windows 10']
  }
];