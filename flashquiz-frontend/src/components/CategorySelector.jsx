import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CategorySelector = ({ selectedCategory, setSelectedCategory, categories }) => {
  return (
    <Box sx={{ minWidth: 240, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Select Category</InputLabel>
        <Select
          labelId="category-label"
          value={selectedCategory}
          label="Select Category"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategorySelector;