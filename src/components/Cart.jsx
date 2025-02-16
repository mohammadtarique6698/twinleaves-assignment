import React, { useContext } from "react";
import { CartContext } from "../context/ContextCart";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <Container>
      <Typography variant="h4">Shopping Cart</Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <List>
          {cart.map((item) => (
            <ListItem key={item.sku_code}>
              <ListItemText
                primary={item.name}
                secondary={`Price: ${item.mrp.currency} ${item.mrp.mrp} | Quantity: ${item.quantity}`}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeFromCart(item.sku_code)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" href="/home">
        Go to home
      </Button>
    </Container>
  );
};

export default Cart;
