import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useEffect, useState } from "react";

export default function GigCard({ title, photo }) {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (photo) {
      setImageUrl("data:image/jpeg;base64," + photo);
    }
  }, [photo]);

  return (
    <Box sx={{ minHeight: 350 }}>
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
            <div>
              <Typography level="title-lg">
                <Link
                  href="#container-responsive"
                  overlay
                  underline="none"
                  sx={{
                    color: "text.primary",
                    "&.Mui-focusVisible:after": { outlineOffset: "-4px" },
                  }}
                >
                  <Typography>{title}</Typography>
                </Link>
              </Typography>
            </div>
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              title="Add to Favorites"
              sx={{ ml: "auto", alignSelf: "flex-start" }}
            >
              <FavoriteBorderRoundedIcon color="danger" />
            </IconButton>
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
              <Typography level="body-xs">Designed by</Typography>
            </div>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
