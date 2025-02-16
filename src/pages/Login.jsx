/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { users, login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storedLoggedInUser = localStorage.getItem("loggedInUser");
    if (storedLoggedInUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        const enteredUsername = username.trim().toLowerCase();
        const enteredPassword = password.trim();

        // Retrieve stored users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Find user by username
        const existingUser = storedUsers.find(
          (u) => u.username.trim().toLowerCase() === enteredUsername
        );

        // If user does not exist, redirect to /signin
        if (!existingUser) {
          enqueueSnackbar("User does not exist. Redirecting to Sign Up...", {
            variant: "warning",
          });
          setLoading(false);
          setTimeout(() => navigate("/signup"), 2000);
          return;
        }

        // If username is correct but password is incorrect
        if (existingUser.password.trim() !== enteredPassword) {
          enqueueSnackbar("Incorrect password. Please try again.", {
            variant: "error",
          });
          setLoading(false);
          return;
        }

        // If authentication is successful
        enqueueSnackbar("Login successful! Redirecting...", {
          variant: "success",
        });
        login(existingUser);
        navigate("/home");
      } catch (error) {
        enqueueSnackbar("An error occurred. Try again.", { variant: "error" });
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#fff", marginBottom: "1rem" }}
        >
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            sx={{
              marginBottom: "1rem",
              input: { color: "#fff" },
              label: { color: "#ccc" },
              fieldset: { borderColor: "#ccc" },
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{
              marginBottom: "1.5rem",
              input: { color: "#fff" },
              label: { color: "#ccc" },
              fieldset: { borderColor: "#ccc" },
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              background: "linear-gradient(45deg, #ff512f, #dd2476)",
              padding: "0.8rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg, #dd2476, #ff512f)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
