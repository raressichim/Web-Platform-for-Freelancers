import * as React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function GigCard({ id, title, photo, seller }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/gig/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: "300px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={`data:image/jpeg;base64,${photo}`}
        alt={title}
      />
      <Typography variant="h6" component="div" sx={{ mt: 2, color: "#333" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Offered by {seller.username}
      </Typography>
    </Card>
  );
}
