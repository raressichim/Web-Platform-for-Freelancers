import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
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
  }, [loggedInUser.id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "#ffffff",
          zIndex: 9995,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "10px 20px",
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
            sx={{ pl: 0 }}
          >
            <ReactRouterLink to="/">
              <HomeRoundedIcon />
            </ReactRouterLink>
            <Typography color="black" fontWeight={500} fontSize={12}>
              Seller Menu
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{ mt: 1, mb: 2, fontWeight: "bold", color: "#333" }}
          >
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
          marginBottom: "10px", // Reduced the bottom margin
          padding: "20px",
          bgcolor: "#fafafa",
        }}
      >
        {yourGigs && yourGigs.length > 0 && (
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
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
        )}
        {yourGigs && yourGigs.length > 0 ? (
          yourGigs.map((gig) => (
            <Box key={gig.id} sx={{ margin: "10px" }}>
              <GigCardForSeller
                title={gig.title}
                photo={gig.photo}
                id={gig.id}
                sx={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          ))
        ) : (
          <ReactRouterLink
            to="/addGig"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                marginTop: "20vh",
                color: "#555",
              }}
            >
              <WarningAmberOutlinedIcon
                sx={{ fontSize: "3rem", color: "#f44336" }}
              />
              <Typography sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                You don't have any gigs added <br /> Switch to selling to start
              </Typography>
            </Box>
          </ReactRouterLink>
        )}
      </Box>
      <Footer
        sx={{
          bgcolor: "#333",
          color: "white",
          padding: "20px",
          textAlign: "center",
          mt: "auto",
        }}
      ></Footer>
    </Box>
  );
}
