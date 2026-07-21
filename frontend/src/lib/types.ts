// -------------------------------------------------------
// TOKIYO STORE - Central Database Types
// Matches the Supabase schema exactly
// -------------------------------------------------------

export type UserRole = 'customer' | 'admin' | 'manager';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'unpaid' | 'processing' | 'paid' | 'failed' | 'refunded';
export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'received' | 'refunded';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  loyalty_points: number;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface InventoryVariant {
  id: string;
  product_id: string;
  sku: string;
  color: string | null;
  size: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  weight_grams: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  inventory_id: string | null;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  brand_id: string | null;
  collection_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  cost_per_item: number | null;
  sku: string | null;
  barcode: string | null;
  material: string | null;
  care_instructions: string | null;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  rating: number;
  reviews_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category | null;
  brand?: Brand | null;
  inventory?: InventoryVariant[];
  images?: ProductImage[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string | null;
  size?: string | null;
  inventory_id?: string;
  product_id?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount_total: number;
  coupon_id: string | null;
  total: number;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  customer_note: string | null;
  internal_note: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Pick<Profile, 'first_name' | 'last_name'> | null;
  order_items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  inventory_id: string | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  color: string | null;
  size: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string | null;
  amount: number;
  provider: string;
  provider_transaction_id: string | null;
  status: PaymentStatus;
  payment_method_details: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  // Joined
  profile?: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'> | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// Analytics summary type for the admin dashboard
export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  cancelledOrders: number;
  completedOrders: number;
  recentOrders: Order[];
}
