import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReceiptsList from "./pages/ReceiptsList";
import ReceiptDetail from "./pages/ReceiptDetail";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ReceiptForm from "./pages/ReceiptForm";
import Footer from "./components/Footer";
import { NotificationProvider } from "./components/NotificationBus";

function App() {
  return (
    <AuthProvider>
         <NotificationProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipts"
                element={
                  <ProtectedRoute>
                    <ReceiptsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipts/new"
                element={
                  <ProtectedRoute>
                    <ReceiptForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/receipts/:id/edit"
                element={
                  <ProtectedRoute>
                    <ReceiptForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipts/:id"
                element={
                  <ProtectedRoute>
                    <ReceiptDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
export default App;
