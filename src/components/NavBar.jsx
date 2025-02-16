/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { CartContext } from "../context/ContextCart";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Navbar = () => {
  const { loggedInUser, logout } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(loggedInUser);
  }, [loggedInUser]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    enqueueSnackbar("Logout successful! Redirecting...", {
      variant: "success",
      autoHideDuration: 2000,
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    setTimeout(() => navigate("/"), 2000);
    setCurrentUser(null);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Store Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/home"
          sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}
        >
          MyStore
        </Typography>

        {/* Cart Icon */}
        <IconButton component={Link} to="/cart" color="inherit">
          <Badge badgeContent={totalItems} color="secondary">
            <Typography variant="body1" sx={{ marginRight: "4px" }}>
              Cart
            </Typography>
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* User Profile Dropdown */}
        {currentUser ? (
          <>
            <Tooltip title="Profile">
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ bgcolor: "orange" }}>
                  {currentUser.username
                    ? currentUser.username.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem disabled>
                {currentUser.username
                  ? `Hi, ${currentUser.username.split("@")[0]}`
                  : "User"}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button component={Link} to="/" color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
