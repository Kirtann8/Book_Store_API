import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* Routes with Layout */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/books" element={<BooksPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <div className="min-h-screen flex items-center justify-center">
                          <h1 className="text-2xl">Profile Page - Coming Soon</h1>
                        </div>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/books/:id" element={<BookDetailsPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                      <ProtectedRoute adminOnly>
                        <div className="min-h-screen flex items-center justify-center">
                          <h1 className="text-2xl">Admin Panel - Coming Soon</h1>
                        </div>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;