import React, { useState } from "react";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PopUp = ({ open, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(description); // Pass the current state up to the parent component
    onClose(); // Close the popup
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1300,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        maxWidth: "500px",
        width: "100%",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        Describe your problem
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        margin="dense"
        label="Problem Description"
        value={description}
        onChange={handleDescriptionChange}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2, mb: 1 }}>
        Pay
      </Button>
    </Box>
  );
};

export default PopUp;
