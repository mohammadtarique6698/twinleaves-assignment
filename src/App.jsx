import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/ContextCart";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Cart from "./components/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/NavBar";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* ✅ Ensure AuthProvider wraps CartProvider */}
      <SnackbarProvider maxSnack={3}>
        <CartProvider>
          {" "}
          {/* ✅ Now CartProvider gets AuthContext properly */}
          <Router>
            <Navbar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </Router>
        </CartProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
