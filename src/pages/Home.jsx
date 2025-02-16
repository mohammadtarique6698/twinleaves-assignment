import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";
import { fetchProducts } from "../api/product"; // Import fetch function
import { Container, CircularProgress, Box } from "@mui/material";

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const products = await fetchProducts();
      setData(products);
      setLoading(false);
    };

    getProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ padding: 3 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <ProductTable
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          data={data}
        />
      )}
    </Container>
  );
};

export default Home;
