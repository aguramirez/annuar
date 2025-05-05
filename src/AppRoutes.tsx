// src/AppRoutes.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './common/components/layouts/AdminLayout';
import POSLayout from './common/components/layouts/POSLayout';
import ValidatorLayout from './common/components/layouts/ValidatorLayout';
import WebsiteLayout from './common/components/layouts/WebsiteLayout';

// Website Routes (Public)
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

// Auth components
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  // State for shared data between routes
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<{ date: string; time: string }>({
    date: "",
    time: ""
  });
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Mock movies data for initial render
  const [movies, setMovies] = useState<any[]>([
    {
      id: 1,
      title: "Example Movie",
      director: "Director Name",
      genre: ["Action", "Adventure"],
      duration: 120,
      releaseDate: "2025-01-01",
      poster: "https://via.placeholder.com/300x450",
      heroImage: "https://via.placeholder.com/1920x1080",
      synopsis: "Example movie synopsis.",
      trailerUrl: "https://www.youtube.com/embed/example",
      rating: 4.5,
      showtimes: [
        {
          date: "2025-05-10",
          times: ["14:30", "18:00", "21:15"]
        }
      ]
    }
  ]);
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Website Routes */}
          <Route path="/" element={<WebsiteLayout />}>
            <Route index element={<Home movies={movies} setSelectedMovie={setSelectedMovie} />} />
            <Route path="movie/:id" element={<MovieDetail
              movie={selectedMovie}
              setSelectedShowtime={setSelectedShowtime}
              setTicketCount={setTicketCount}
            />} />
            <Route path="seats" element={<SeatSelection
              movie={selectedMovie}
              showtime={selectedShowtime}
              ticketCount={ticketCount}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />} />
            <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="payment" element={<Payment
              movie={selectedMovie}
              showtime={selectedShowtime}
              ticketCount={ticketCount}
              selectedSeats={selectedSeats}
            />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
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
              <ProtectedRoute requiredRole="staff">
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
              <ProtectedRoute requiredRole="staff">
                <ValidatorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ScanQR />} />
            <Route path="settings" element={<ValidatorSettings />} />
          </Route>

          {/* Redirect 404 to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;