import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ setSearch }) => {
  return (
    <TextField
      label="Search Products"
      variant="outlined"
      fullWidth
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
