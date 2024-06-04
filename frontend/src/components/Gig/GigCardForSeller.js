import * as React from "react";
import { useNavigate } from "react-router-dom";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { useEffect, useState } from "react";

export default function GigCardForSeller({ title, photo, id }) {
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (photo) {
      setImageUrl("data:image/jpeg;base64," + photo);
    }
  }, [photo]);

  const handleClick = () => {
    navigate(`/gigUpdate/${id}`);
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
      <AspectRatio
        variant="soft"
        sx={{
          "--AspectRatio-paddingBottom": "56.25%", // 16:9 ratio
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AspectRatio>
      <Typography variant="h6" component="div" sx={{ mt: 2, color: "#333" }}>
        {title}
      </Typography>
    </Card>
  );
}
