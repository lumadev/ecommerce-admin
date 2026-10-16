import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AdminAuthProvider } from "@/features/auth/providers/admin-auth.provider";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { AdminLayout } from "@/features/AdminLayout";
import AdminHome from "@/features/AdminHome";
import { AdminLoadingScreen } from "@/features/components/AdminLoadingScreen";
import AdminLogin from "@/features/login/AdminLogin";
import OrderPage from "@/features/order/OrderPage";
import AdminProducts from "@/features/product/AdminProducts";
import AdminCategories from "@/features/category/AdminCategories";
import AdminHighlights from "@/features/highlight/AdminHighlights";
import AdminMerchants from "@/features/merchant/AdminMerchants";
import EditMerchantPage from "@/features/merchant/EditMerchantPage";
import AdminCustomers from "@/features/customer/AdminCustomers";
import AdminVariants from "@/features/variant/AdminVariants";
import RoadmapPage from "@/features/roadmap/RoadmapPage";
import NotFound from "@/pages/NotFound";

const RequireAdmin = () => {
  const { isAuthenticated, isCheckingSession } = useAdminAuth();
  const location = useLocation();

  if (isCheckingSession) {
    return <AdminLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <AdminLayout />;
};

const RedirectIfAuthenticated = () => {
  const { isAuthenticated, isCheckingSession } = useAdminAuth();

  if (isCheckingSession) {
    return <AdminLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AdminLogin />;
};

const RequireSuperAdmin = () => {
  const { user } = useAdminAuth();

  if (user?.role !== "SUPER_ADMIN") {
    return <Navigate to="/pedidos" replace />;
  }

  return <Outlet />;
};

export const AdminRoutes = () => (
  <AdminAuthProvider>
    <Routes>
      <Route path="/login" element={<RedirectIfAuthenticated />} />
      <Route path="/*" element={<RequireAdmin />}>
        <Route index element={<AdminHome />} />
        <Route path="pedidos" element={<OrderPage />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="destaques" element={<AdminHighlights />} />
        <Route path="clientes" element={<AdminCustomers />} />
        <Route path="variantes" element={<AdminVariants />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="lojas" element={<RequireSuperAdmin />}>
          <Route index element={<AdminMerchants />} />
          <Route path=":merchantId/editar" element={<EditMerchantPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </AdminAuthProvider>
);
