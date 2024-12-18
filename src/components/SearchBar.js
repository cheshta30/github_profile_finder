import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../App.css";

function SearchBar({ handleSubmit }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(searchQuery);
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <TextField
        fullWidth
        label="Search Github Username"
        placeholder="Enter username..."
        size="large"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <Button id="SubmitButton" type="submit" variant="contained">
              Search
            </Button>
          ),
        }}
      />
    </form>
  );
}

export default SearchBar;
