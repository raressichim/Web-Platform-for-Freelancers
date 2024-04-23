import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GigCard({ id, title, photo, seller }) {
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (photo) {
      setImageUrl("data:image/jpeg;base64," + photo);
    }
  }, [photo]);

  const handleClick = () => {
    navigate(`/gig/${id}`);
  };

  return (
    <Box sx={{ minHeight: 350 }} onClick={handleClick}>
      <Card
        variant="outlined"
        sx={(theme) => ({
          width: 300,
          gridColumn: "span 2",
          flexDirection: "row",
          flexWrap: "wrap",
          resize: "horizontal",
          overflow: "hidden",
          gap: "clamp(0px, (100% - 360px + 32px) * 999, 16px)",
          transition: "transform 0.3s, border 0.3s",
          "&:hover": {
            borderColor: theme.vars.palette.primary.outlinedHoverBorder,
            transform: "translateY(-2px)",
          },
          "& > *": { minWidth: "clamp(0px, (360px - 100%) * 999,100%)" },
        })}
      >
        <AspectRatio
          variant="soft"
          sx={{
            flexGrow: 1,
            display: "contents",
            "--AspectRatio-paddingBottom":
              "clamp(0px, (100% - 360px) * 999, min(calc(100% / (16 / 9)), 300px))",
          }}
        ></AspectRatio>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 200,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography>{title}</Typography>
          </Box>
          <AspectRatio
            variant="soft"
            sx={{
              "--AspectRatio-paddingBottom":
                "clamp(0px, (100% - 200px) * 999, 200px)",
              pointerEvents: "none",
            }}
          >
            <img src={imageUrl} alt="" />
          </AspectRatio>
          <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
            <div>
              <Typography>Offered by {seller.username}</Typography>
            </div>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
