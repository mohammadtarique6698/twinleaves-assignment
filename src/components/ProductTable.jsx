import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  Avatar,
  Modal,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchProducts } from "../api/product";
import ProductImage from "../product.jpg";
import SearchBar from "./SearchBar";
import { CartContext } from "../context/ContextCart";

const ProductTable = ({ search, setSearch }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { addCart } = useContext(CartContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);

        // Count products per category
        const counts = data.reduce((acc, product) => {
          acc[product.main_category] = (acc[product.main_category] || 0) + 1;
          return acc;
        }, {});
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "" || product.main_category === selectedCategory) &&
      (search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.main_category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRowClick = (params) => {
    setSelectedProduct(params.row);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Category List Section */}
      <Grid item xs={12} md={3}>
        <SearchBar setSearch={setSearch} />
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            marginTop: "2rem",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Categories
          </Typography>
          <List>
            <ListItem
              key=""
              component="button"
              onClick={() => setSelectedCategory("")}
              selected={selectedCategory === ""}
            >
              <ListItemText primary={`All (${products.length})`} />
            </ListItem>
            <Divider />
            {Object.entries(categoryCounts).map(([cat, count], index) => (
              <React.Fragment key={cat}>
                <ListItem
                  component="button"
                  onClick={() => setSelectedCategory(cat)}
                  selected={selectedCategory === cat}
                >
                  <ListItemText primary={`${cat} (${count})`} />
                </ListItem>
                <Divider key={`divider-${cat}`} />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Product Table Section */}
      <Grid item xs={12} md={9}>
        <Box
          sx={{
            height: "85vh",
            width: "100%",
            backgroundColor: "white",
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={[
              {
                field: "image",
                headerName: "Image",
                width: 150,
                renderCell: (params) => (
                  <img
                    src={params.row.image || ProductImage}
                    alt={params.row.name || "Product"}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectPosition: "center",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                  />
                ),
              },
              {
                field: "name",
                headerName: "Product Name",
                width: 380,
                sortable: true,
              },
              {
                field: "main_category",
                headerName: "Category",
                width: 200,
                sortable: true,
              },
              {
                field: "mrp",
                headerName: "Price",
                width: 150,
                sortable: true,
                sortComparator: (v1, v2) => {
                  const price1 = v1?.mrp ? parseFloat(v1.mrp) : 0;
                  const price2 = v2?.mrp ? parseFloat(v2.mrp) : 0;
                  return price1 - price2;
                },
                renderCell: (params) =>
                  params.value
                    ? `${params.value.currency} ${params.value.mrp}`
                    : "N/A",
              },
              {
                field: "addToCart",
                headerName: "Add to Cart",
                width: 150,
                renderCell: (params) => (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (!addCart) {
                        console.error("addToCart is undefined!");
                        return;
                      }
                      addCart(params.row);
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Add to Cart
                  </Button>
                ),
              },
            ]}
            getRowId={(row, index) => row.sku_code || `row-${index}`}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10]}
            rowHeight={100}
            onRowClick={handleRowClick}
            sx={{
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
              },
              "& .MuiDataGrid-columnHeader": {
                textAlign: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0f0f0",
                cursor: "pointer",
              },
            }}
          />
        </Box>
      </Grid>

      {/* Product Details Modal */}
      <Modal open={!!selectedProduct} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedProduct && (
            <Card sx={{ padding: 2 }}>
              <Avatar
                src={selectedProduct.image || ProductImage}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "auto",
                  borderRadius: "100%",
                }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedProduct.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 3 }}
                >
                  Category: {selectedProduct.main_category}
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 3 }}>
                  Price: {selectedProduct.mrp.currency}{" "}
                  {selectedProduct.mrp.mrp}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 3 }}
                >
                  Description: Experience the perfect blend of style and
                  functionality with this premium product. Designed for
                  durability and comfort, it's crafted with high-quality
                  materials to ensure long-lasting performance. A must-have
                  addition to your collection!
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Modal>
    </Grid>
  );
};

export default ProductTable;

// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Avatar,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { fetchProducts } from "../api/product";

// const ProductTable = ({ search, category, setCategory }) => {
//   const [products, setProducts] = useState([]);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     const getProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         console.log(data);
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     getProducts();
//   }, []);

//   // Filtering logic
//   const filteredProducts = products.filter(
//     (product) =>
//       (category === "" || product.main_category === category) &&
//       (search === "" ||
//         product.name.toLowerCase().includes(search.toLowerCase()))
//   );

//   // Define DataGrid columns
//   const columns = [
//     {
//       field: "image",
//       headerName: "Image",
//       width: 100,
//       renderCell: (params) => <Avatar src={params.value} />,
//     },
//     { field: "name", headerName: "Product Name", width: 400 },
//     { field: "main_category", headerName: "Category", width: 220 },
//     {
//       field: "mrp",
//       headerName: "Price",
//       width: 220,
//       renderCell: (params) =>
//         params.value ? `${params.value.currency} ${params.value.mrp}` : "N/A",
//     },
//   ];

//   return (
//     <Grid container spacing={3} sx={{ padding: 3 }}>
//       {/* Filter Section */}
//       <Grid item xs={12} md={3}>
//         <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
//           <FormControl fullWidth sx={{ marginBottom: 2 }}>
//             <InputLabel>Category</InputLabel>
//             <Select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <MenuItem value="">All</MenuItem>
//               {.map((cat) => (
//                 <MenuItem key={cat} value={cat}>
//                   {cat}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//       </Grid>

//       {/* Product Table Section */}
//       <Grid item xs={12} md={9}>
//         <Box
//           sx={{
//             height: 1000,
//             width: "100%",
//             backgroundColor: "white",
//             boxShadow: 2,
//             borderRadius: 2,
//           }}
//         >
//           <DataGrid
//             rows={filteredProducts || []}
//             columns={columns}
//             getRowId={(row) => row.sku_code || Math.random()}
//             pageSize={pageSize}
//             pagination
//             pageSizeOptions={[10]}
//             sx={{
//               "& .MuiDataGrid-cell": {
//                 height: "80px",
//                 flex: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               },
//             }} // Adjust cell height
//           />
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default ProductTable;
