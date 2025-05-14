// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import Register from './apps/website/pages/RegisterPage';
import Payment from './apps/website/pages/Payment';
import CandyStore from './apps/website/pages/CandyStore';
import CandyCheckout from './apps/website/pages/CandyCheckout';
import Subscription from './apps/website/pages/Subscription';
import Profile from './apps/website/pages/Profile'; // Importamos el nuevo componente

// Admin Routes
import Dashboard from './apps/admin/pages/Dashboard';
import MovieManagement from './apps/admin/pages/MovieManagement';
import ShowManagement from './apps/admin/pages/ShowManagement';
import ProductManagement from './apps/admin/pages/ProductManagement';
import ReportingSales from './apps/admin/pages/ReportingSales';
import AdminSettings from './apps/admin/pages/AdminSettings';
import UserManagement from './apps/admin/pages/UserManagement';

// POS Routes
import POSHome from './apps/pos/pages/POSHome';
import POSSeatSelection from './apps/pos/pages/POSSeatSelection';
import POSProducts from './apps/pos/pages/POSProducts';
import POSCheckout from './apps/pos/pages/POSCheckout';

// Validator Routes
import ScanQR from './apps/validator/pages/ScanQR';
import ValidatorSettings from './apps/validator/pages/ValidatorSettings';

// Other
import DebugAuth from './apps/website/pages/DebugAuth';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Website Routes */}
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="movie/:id" element={<MovieDetail />} />
        <Route path="seats/:showId" element={<SeatSelection />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Rutas de la Cartelera */}
        <Route path="cartelera" element={<Home />} />
        <Route path="proximos" element={<Home />} />
        <Route path="promotions" element={<Home />} />
        
        {/* User Profile */}
        <Route path="profile" element={<Profile />} />
        
        {/* New Candy Store Routes */}
        <Route path="candy" element={<CandyStore />} />
        <Route path="candy-checkout" element={<CandyCheckout />} />
        
        {/* Premium Subscription Route */}
        <Route path="subscription" element={<Subscription />} />
        
        {/* Payment Routes */}
        <Route path="payment/:reservationId" element={<Payment />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="movies" element={<MovieManagement />} />
        <Route path="shows" element={<ShowManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports/sales" element={<ReportingSales />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* POS Routes */}
      <Route path="/pos" element={<POSLayout />}>
        <Route index element={<POSHome />} />
        <Route path="seats/:showId" element={<POSSeatSelection />} />
        <Route path="products" element={<POSProducts />} />
        <Route path="checkout" element={<POSCheckout />} />
      </Route>

      {/* Validator Routes */}
      <Route path="/validator" element={<ValidatorLayout />}>
        <Route index element={<ScanQR />} />
        <Route path="settings" element={<ValidatorSettings />} />
      </Route>

      {/* Debug Route */}
      <Route path="/debug-auth" element={<DebugAuth />} />
    </Routes>
  );
};

export default AppRoutes;