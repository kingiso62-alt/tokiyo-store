import { supabase } from "./supabase";
import type {
  Product, Category, Brand, Order, OrderItem, InventoryVariant,
  Review, Coupon, WishlistItem, CartItem, ShippingAddress, DashboardAnalytics
} from "./types";

// -------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------

export async function fetchProducts(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  trending?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      brand:brands(id, name, slug),
      images:product_images(id, image_url, is_primary, display_order),
      inventory(id, color, size, stock_quantity, low_stock_threshold)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filters?.featured) query = query.eq("is_featured", true);
  if (filters?.trending) query = query.eq("is_trending", true);
  if (filters?.category) query = query.eq("categories.slug", filters.category);
  if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Product[];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  return fetchProducts({ featured: true, limit: 8 });
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      brand:brands(id, name, slug),
      images:product_images(id, image_url, is_primary, display_order, alt_text),
      inventory(id, sku, color, size, stock_quantity, low_stock_threshold)
    `)
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return data as Product;
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      brand:brands(id, name, slug),
      images:product_images(id, image_url, is_primary, display_order, alt_text),
      inventory(id, sku, color, size, stock_quantity, low_stock_threshold)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) throw error;
  return data as Product;
}

// Admin: All products (including unpublished)
export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      brand:brands(id, name, slug),
      inventory(id, stock_quantity)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Product[];
}

// Admin: Create / Update / Delete products
export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// -------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Category[];
}

export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Category[];
}

// -------------------------------------------------------
// BRANDS
// -------------------------------------------------------

export async function fetchAllBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Brand[];
}

// -------------------------------------------------------
// INVENTORY
// -------------------------------------------------------

export async function fetchInventory(): Promise<InventoryVariant[]> {
  const { data, error } = await supabase
    .from("inventory")
    .select("*, product:products(id, title, sku)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as InventoryVariant[];
}

export async function updateInventoryStock(inventoryId: string, newQuantity: number) {
  const { error } = await supabase
    .from("inventory")
    .update({ stock_quantity: newQuantity, updated_at: new Date().toISOString() })
    .eq("id", inventoryId);

  if (error) throw error;
}

// -------------------------------------------------------
// REVIEWS
// -------------------------------------------------------

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profile:profiles(first_name, last_name, avatar_url)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Review[];
}

export async function createReview(review: {
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const { data, error } = await supabase.from("reviews").insert(review).select().single();
  if (error) throw error;
  return data;
}

// -------------------------------------------------------
// ORDERS
// -------------------------------------------------------

export async function fetchMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), payments(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, profile:profiles(first_name, last_name), order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  // If cancelled, restore inventory
  if (status === 'cancelled') {
    await restoreInventoryForOrder(orderId);
  }

  return data;
}

export async function fetchOrderStatusHistory(orderId: string) {
  const { data, error } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addOrderStatusHistory(orderId: string, status: string, note?: string) {
  const { data, error } = await supabase
    .from("order_status_history")
    .insert({ order_id: orderId, status, note })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function restoreInventoryForOrder(orderId: string) {
  // Fetch order items
  const { data: items, error } = await supabase
    .from("order_items")
    .select("inventory_id, quantity")
    .eq("order_id", orderId);

  if (error || !items) return;

  for (const item of items) {
    if (!item.inventory_id) continue;
    // Use RPC to safely increment
    await supabase.rpc("increment_inventory_stock", {
      p_inventory_id: item.inventory_id,
      p_quantity: item.quantity,
    });
  }
}

// -------------------------------------------------------
// CHECKOUT: Create Order (the full transaction)
// -------------------------------------------------------

export interface CheckoutPayload {
  userId: string;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discountTotal: number;
  total: number;
  couponId?: string | null;
  paymentProvider?: string;
  customerNote?: string;
}

export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  // 1. Create the order record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.userId,
      subtotal: payload.subtotal,
      tax: payload.tax,
      shipping_fee: payload.shippingFee,
      discount_total: payload.discountTotal,
      total: payload.total,
      shipping_address: payload.shippingAddress,
      billing_address: payload.billingAddress,
      coupon_id: payload.couponId || null,
      customer_note: payload.customerNote || null,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order_items
  const orderItems: Partial<OrderItem>[] = payload.cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id || null,
    inventory_id: item.inventory_id || null,
    product_name: item.name,
    sku: null,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    color: item.color || null,
    size: item.size || null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  // 3. Create payment record
  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: order.id,
    user_id: payload.userId,
    amount: payload.total,
    provider: payload.paymentProvider || "pending",
    status: "unpaid",
  });
  if (paymentError) throw paymentError;

  // 4. Decrement inventory for each item via RPC
  for (const item of payload.cartItems) {
    if (item.inventory_id) {
      const { error: rpcError } = await supabase.rpc("decrement_inventory_stock", {
        p_inventory_id: item.inventory_id,
        p_quantity: item.quantity,
      });
      if (rpcError) console.error("Inventory decrement error for", item.inventory_id, rpcError);
    }
  }

  return order as Order;
}

// -------------------------------------------------------
// CART (Cloud sync for logged-in users)
// -------------------------------------------------------

export async function fetchOrCreateCart(userId: string): Promise<string> {
  // Try to find existing cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cart) return cart.id;

  // Create a new cart
  const { data: newCart, error: createError } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (createError) throw createError;
  return newCart.id;
}

export async function fetchCartItems(cartId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      inventory:inventory(id, color, size, stock_quantity),
      product:products(id, title, price, images:product_images(image_url, is_primary))
    `)
    .eq("cart_id", cartId);

  if (error) throw error;

  return (data || []).map((item: any) => {
    const primaryImage = item.product?.images?.find((i: any) => i.is_primary)?.image_url
      || item.product?.images?.[0]?.image_url
      || "";
    return {
      id: item.id,
      name: item.product?.title || "",
      price: item.product?.price || 0,
      quantity: item.quantity,
      image: primaryImage,
      color: item.inventory?.color || null,
      size: item.inventory?.size || null,
      inventory_id: item.inventory?.id,
      product_id: item.product?.id,
    };
  });
}

export async function addItemToCart(cartId: string, inventoryId: string, quantity = 1, productId?: string) {
  let resolvedProductId = productId;
  if (!resolvedProductId) {
    const { data } = await supabase
      .from("inventory")
      .select("product_id")
      .eq("id", inventoryId)
      .single();
    if (data) resolvedProductId = data.product_id;
  }

  // Upsert: if same inventory_id in cart, increment
  const { error } = await supabase.from("cart_items").upsert(
    { cart_id: cartId, inventory_id: inventoryId, product_id: resolvedProductId, quantity },
    { onConflict: "cart_id,inventory_id" }
  );
  if (error) throw error;
}

export async function removeItemFromCart(cartItemId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
  if (error) throw error;
}

export async function clearCartItems(cartId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId);
  if (error) throw error;
}

// -------------------------------------------------------
// WISHLIST
// -------------------------------------------------------

export async function fetchWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      id,
      product_id,
      created_at,
      product:products(
        id, title, price, slug, rating, reviews_count,
        images:product_images(image_url, is_primary)
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return (data || []) as unknown as WishlistItem[];
}

export async function addToWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlists")
    .upsert({ user_id: userId, product_id: productId }, { onConflict: "user_id,product_id" });
  if (error) throw error;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) throw error;
}

// -------------------------------------------------------
// COUPONS
// -------------------------------------------------------

export async function validateCoupon(code: string, orderTotal: number): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  const coupon = data as Coupon;

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return null;
  // Check usage limit
  if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) return null;
  // Check minimum order value
  if (orderTotal < coupon.min_order_value) return null;

  return coupon;
}

// -------------------------------------------------------
// ADMIN: DASHBOARD ANALYTICS
// -------------------------------------------------------

export async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  const [ordersResult, customersResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, status, created_at, profile:profiles(first_name, last_name), order_items(*)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "customer"),
  ]);

  if (ordersResult.error) throw ordersResult.error;

  const orders = (ordersResult.data || []) as unknown as Order[];
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customersResult.count || 0,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    completedOrders: orders.filter((o) => o.status === "delivered").length,
    recentOrders: orders.slice(0, 10),
  };
}

// -------------------------------------------------------
// ADMIN: CUSTOMERS
// -------------------------------------------------------

export async function fetchAllCustomers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// -------------------------------------------------------
// ADMIN: COUPONS
// -------------------------------------------------------

export async function fetchAllCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Coupon[];
}

export async function createCoupon(coupon: Partial<Coupon>) {
  const { data, error } = await supabase.from("coupons").insert(coupon).select().single();
  if (error) throw error;
  return data;
}

export async function updateCoupon(id: string, updates: Partial<Coupon>) {
  const { data, error } = await supabase.from("coupons").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

// -------------------------------------------------------
// GLOBAL STORE SETTINGS & HOMEPAGE CONFIGURATION
// -------------------------------------------------------

export async function fetchStoreSettings(): Promise<Record<string, any>> {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;

  const settingsMap: Record<string, any> = {};
  data?.forEach((row) => {
    settingsMap[row.key] = row.value;
  });
  return settingsMap;
}

export async function updateStoreSettings(key: string, value: any): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

// -------------------------------------------------------
// PRODUCT VARIANTS & IMAGES
// -------------------------------------------------------

export async function createInventoryVariant(variant: any) {
  const { data, error } = await supabase.from("inventory").insert(variant).select().single();
  if (error) throw error;
  return data;
}

export async function updateInventoryVariant(id: string, updates: any) {
  const { data, error } = await supabase.from("inventory").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteInventoryVariant(id: string) {
  const { error } = await supabase.from("inventory").delete().eq("id", id);
  if (error) throw error;
}

export async function createProductImage(img: any) {
  const { data, error } = await supabase.from("product_images").insert(img).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProductImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
}
