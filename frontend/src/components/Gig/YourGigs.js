import * as React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GigCardForSeller from "./GigCardForSeller";
import { Card, CardActionArea, Icon } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Footer from "../footer/Footer";

export default function YourGigs() {
  const [yourGigs, setYourGigs] = useState(null);
  const { loggedInUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigs = async () => {
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
    fetchGigs();
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "0.5rem",
          overflow: "auto",
        }}
      >
        <Card
          sx={{
            width: 300,
            height: 270,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#e0e0e0",
            color: "action.active",
            "&:hover": {
              backgroundColor: "#d5d5d5",
              cursor: "pointer",
            },
          }}
          onClick={() => navigate("/addGig")}
        >
          <CardActionArea
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: "50px" }}>
              <AddCircleOutlineIcon />
            </Icon>
          </CardActionArea>
        </Card>
        {yourGigs && yourGigs.length > 0 ? (
          yourGigs.map((gig) => (
            <GigCardForSeller
              key={gig.id}
              title={gig.title}
              photo={gig.photo}
              id={gig.id}
            />
          ))
        ) : (
          <ReactRouterLink to="/addGig">
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
      <Footer />
    </Box>
  );
}
