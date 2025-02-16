/* eslint-disable no-unused-vars */
import React, { useState } from "react";
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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      try {
        // Retrieve existing users or initialize an empty array
        const storedData = localStorage.getItem("users");
        let storedUsers = storedData ? JSON.parse(storedData) : [];

        // Ensure storedUsers is an array
        if (!Array.isArray(storedUsers)) {
          storedUsers = [];
        }

        // Check if username already exists
        const userExists = storedUsers.some(
          (user) => user.username === username.trim().toLowerCase()
        );

        if (userExists) {
          enqueueSnackbar("Username already exists. Choose a different one.", {
            variant: "error",
          });
          setLoading(false);
          return;
        }

        // Add new user to the array
        const newUser = {
          username: username.trim().toLowerCase(),
          password: password.trim(),
          cart: cart,
        };

        storedUsers.push(newUser);

        // Save updated array back to localStorage
        localStorage.setItem("users", JSON.stringify(storedUsers));

        enqueueSnackbar("Signup successful! Redirecting to login...", {
          variant: "success",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
        });
        console.error("Signup error:", error);
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
          Signup
        </Typography>
        <form onSubmit={handleSignup}>
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
              "Signup"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;
