import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link as ReactRouterLink } from "react-router-dom";
import GigCard from "../home/GigCard";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function YourGigs() {
  const [yourGigs, setYourGigs] = useState(null);
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchRecentGigs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/gig/getYourGigs/${loggedInUser.id}`
        );
        const data = await response.json();
        setYourGigs(data);
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };
    fetchRecentGigs();
  });

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <ReactRouterLink to="/">
              <HomeRoundedIcon />
            </ReactRouterLink>
            <Typography color="black" fontWeight={500} fontSize={12}>
              Seller Menu
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            Your gigs
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {yourGigs && yourGigs.length > 0 ? (
          yourGigs.map((gig) => (
            <GigCard
              key={gig.id}
              title={gig.title}
              photo={gig.photo}
              seller={gig.owner.user.username}
            />
          ))
        ) : (
          <ReactRouterLink to="/sellerBoard">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginTop: "20vh",
              }}
            >
              <WarningAmberOutlinedIcon sx={{ fontSize: "3rem" }} />
              <Typography sx={{ fontSize: "1.5rem" }}>
                You don't have any gigs added {<br />} Switch to selling to
                start
              </Typography>
            </Box>
          </ReactRouterLink>
        )}
      </Box>
    </Box>
  );
}
