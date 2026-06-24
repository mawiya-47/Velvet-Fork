/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  category: string; // 'Starters', 'Pizza', 'Burgers', 'BBQ', 'Pakistani Food', 'Pasta', 'Seafood', 'Desserts', 'Drinks'
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  price: number;
  rating: number;
  prepTime: string; // e.g. "15-20 mins"
  images: string[]; // URLs of food photography
  tags: string[]; // e.g. ['Chef Choice', 'Gluten Free', 'Spicy', 'Vegan']
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  points: number; // loyalty rewards
  balance: number; // simulated wallet balance
  wishlist: string[]; // IDs of menu items
  createdAt: string;
  savedAddress?: string;
  phone?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  pointsEarned: number;
  pointsUsed: number;
  address: string;
  phone: string;
  paymentMode: 'wallet' | 'card'; // using simulated Stripe / Wallet
  paymentStatus: 'paid' | 'pending';
  status: 'Received' | 'Preparing' | 'In Transit' | 'Delivered' | 'Cancelled';
  date: string;
  specialInstructions?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  time: string;
  guests: number;
  specialInstructions?: string;
  tableNumber: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Checked In';
  eventType: string; // 'Standard Dining' | 'Private Event' | 'Birthday' | 'Anniversary' | 'Business Meeting'
  cardChargedAmount?: number; // event deposits
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  menuItemId?: string; // Optional if general restaurant review
  rating: number;
  comment: string;
  date: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  readTime: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minAmount: number;
  active: boolean;
  description: string;
}

export interface Notification {
  id: string;
  userId?: string; // Empty means public alert (e.g. daily special)
  title: string;
  message: string;
  type: 'admin' | 'order' | 'reservation' | 'system' | 'special';
  date: string;
  read: boolean;
}
