import { Route, Routes } from "react-router-dom";

import Navbar from "@/layout/navbar/Navbar";
import PagesIndex from "@/pages/PagesIndex";
import Products from "@/features/product/ProductsIndex";
import ProductDetails from "@/features/product/details/ProductDetails";
import MyOrders from "@/features/order/MyOrders";
import RoadmapPage from "@/features/roadmap/RoadmapPage";
import { ResetPasswordModal } from "@/features/auth/reset-password/ResetPasswordModal";
import NotFound from "@/pages/NotFound";
import CheckoutPage from "@/features/checkout/CheckoutPage";

export const CustomerRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<PagesIndex />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
      <Route path="/meus-pedidos" element={<MyOrders />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/future" element={<RoadmapPage />} />
      <Route path="/redefinir-senha" element={<ResetPasswordModal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);
