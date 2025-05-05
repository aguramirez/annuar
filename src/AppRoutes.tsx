// src/AppRoutes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import AdminLayout from './common/components/layouts/AdminLayout';
import POSLayout from './common/components/layouts/POSLayout';
import ValidatorLayout from './common/components/layouts/ValidatorLayout';
import WebsiteLayout from './common/components/layouts/WebsiteLayout';

// Website Routes
import Home from './apps/website/pages/Home';
import MovieDetail from './apps/website/pages/MovieDetail';
import SeatSelection from './apps/website/pages/SeatSelection';
import Login from './apps/website/pages/Login';
import Payment from './apps/website/pages/Payment';

// Admin Routes
import Dashboard from './apps/admin/pages/Dashboard';
import MovieManagement from './apps/admin/pages/MovieManagement';
import ShowManagement from './apps/admin/pages/ShowManagement';
import ProductManagement from './apps/admin/pages/ProductManagement';
import ReportingSales from './apps/admin/pages/ReportingSales';
import AdminSettings from './apps/admin/pages/AdminSettings';

// POS Routes
import POSHome from './apps/pos/pages/POSHome';
import POSSeatSelection from './apps/pos/pages/POSSeatSelection';
import POSProducts from './apps/pos/pages/POSProducts';
import POSCheckout from './apps/pos/pages/POSCheckout';

// Validator Routes
import ScanQR from './apps/validator/pages/ScanQR';
import ValidatorSettings from './apps/validator/pages/ValidatorSettings';

// Auth
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Website Routes */}
          <Route path="/" element={<WebsiteLayout />}>
            <Route index element={<Home />} />
            <Route path="movie/:id" element={<MovieDetail />} />
            <Route path="seats/:showId" element={<SeatSelection />} />
            <Route path="login" element={<Login />} />
            <Route path="payment/:reservationId" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="movies" element={<MovieManagement />} />
            <Route path="shows" element={<ShowManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="reports/sales" element={<ReportingSales />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* POS Routes */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "STAFF"]}>
                <POSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<POSHome />} />
            <Route path="seats/:showId" element={<POSSeatSelection />} />
            <Route path="products" element={<POSProducts />} />
            <Route path="checkout" element={<POSCheckout />} />
          </Route>

          {/* Validator Routes */}
          <Route
            path="/validator"
            element={
              <ProtectedRoute requiredRole={["ADMIN", "STAFF"]}>
                <ValidatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ScanQR />} />
            <Route path="settings" element={<ValidatorSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;