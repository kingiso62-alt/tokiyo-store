import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy, useEffect } from "react";
import { MainLayout } from "./layout/MainLayout";
import { AdminLayout } from "./layout/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy Loaded Customer Pages
const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Shop = lazy(() => import("./pages/Shop").then(m => ({ default: m.Shop })));
const ProductDetails = lazy(() => import("./pages/ProductDetails").then(m => ({ default: m.ProductDetails })));
const OutfitBuilder = lazy(() => import("./pages/OutfitBuilder").then(m => ({ default: m.OutfitBuilder })));
const Cart = lazy(() => import("./pages/Cart").then(m => ({ default: m.Cart })));
const Wishlist = lazy(() => import("./pages/Wishlist").then(m => ({ default: m.Wishlist })));
const Checkout = lazy(() => import("./pages/Checkout").then(m => ({ default: m.Checkout })));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess").then(m => ({ default: m.OrderSuccess })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("./pages/Signup").then(m => ({ default: m.Signup })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const Profile = lazy(() => import("./pages/Profile").then(m => ({ default: m.Profile })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./pages/TermsOfService").then(m => ({ default: m.TermsOfService })));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy").then(m => ({ default: m.ShippingPolicy })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const FAQ = lazy(() => import("./pages/FAQ").then(m => ({ default: m.FAQ })));
const SizeGuide = lazy(() => import("./pages/SizeGuide").then(m => ({ default: m.SizeGuide })));
const SandboxPayment = lazy(() => import("./pages/SandboxPayment").then(m => ({ default: m.SandboxPayment })));
const DriverDashboard = lazy(() => import("./pages/driver/DriverDashboard").then(m => ({ default: m.DriverDashboard })));
const Offline = lazy(() => import("./pages/Offline").then(m => ({ default: m.Offline })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: m.Blog })));

// Lazy Loaded Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts").then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders })));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory").then(m => ({ default: m.AdminInventory })));
const AdminMarketing = lazy(() => import("./pages/admin/AdminMarketing").then(m => ({ default: m.AdminMarketing })));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories").then(m => ({ default: m.AdminCategories })));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands").then(m => ({ default: m.AdminBrands })));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections").then(m => ({ default: m.AdminCollections })));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers").then(m => ({ default: m.AdminCustomers })));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons").then(m => ({ default: m.AdminCoupons })));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews").then(m => ({ default: m.AdminReviews })));
const AdminShipping = lazy(() => import("./pages/admin/AdminShipping").then(m => ({ default: m.AdminShipping })));
const AdminReturns = lazy(() => import("./pages/admin/AdminReturns").then(m => ({ default: m.AdminReturns })));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments").then(m => ({ default: m.AdminPayments })));
const AdminDeliveryLogistics = lazy(() => import("./pages/admin/AdminDeliveryLogistics").then(m => ({ default: m.AdminDeliveryLogistics })));

// Create a client
const queryClient = new QueryClient();

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
  </div>
);

function App() {
  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="shipping" element={<AdminShipping />} />
              <Route path="delivery-logistics" element={<AdminDeliveryLogistics />} />
              <Route path="returns" element={<AdminReturns />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="outfit-builder" element={<OutfitBuilder />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="order-success" element={<OrderSuccess />} />
              
              {/* Auth Routes */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="driver/dashboard" element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <DriverDashboard />
                </ProtectedRoute>
              } />

              {/* Policy Routes */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="shipping" element={<ShippingPolicy />} />

              {/* Informational Routes */}
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="size-guide" element={<SizeGuide />} />
              <Route path="offline" element={<Offline />} />
              <Route path="about" element={<About />} />
              <Route path="blog" element={<Blog />} />
              <Route path="collections" element={<Shop />} />
            </Route>
            
            {/* Checkout outside MainLayout to remove standard header/footer for focus */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sandbox-payment" element={<SandboxPayment />} />
            
            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Wildcard 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
     </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
