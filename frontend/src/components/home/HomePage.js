import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import GigCard from "../Gig/GigCard";
import Footer from "../footer/Footer";
import Searchbar from "../search/SearchBar";
import photo from "../../assets/photo.jpg";

export default function HomePage() {
  const [recentGigs, setRecentGigs] = useState([]);

  useEffect(() => {
    const fetchRecentGigs = async () => {
      try {
        const response = await fetch("http://localhost:8080/gig/getGigs");
        const data = await response.json();
        const sorted = data.sort((a, b) => b.id - a.id).slice(0, 8);
        setRecentGigs(sorted);
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };
    fetchRecentGigs();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        bgcolor: "#fdf5e6", // Cream background color for the main container
      }}
    >
      <Searchbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "46vh",
          overflow: "hidden",
          bgcolor: "#000",
        }}
      >
        <Card style={{ height: "100%", width: "100%", position: "relative" }}>
          <CardMedia
            component="img"
            src={photo}
            alt="Coding GIF"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Typography
            variant="h4"
            component="div"
            sx={{
              position: "absolute",
              textAlign: "center",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "10px",
              borderRadius: "5px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Service for freelancers
            <br />
            Work anytime anywhere
          </Typography>
        </Card>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#E8E8E8", // Cream background color for the recent gigs section
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "20px", color: "#333" }}>
          Recent gigs
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {recentGigs.map((gig) => (
            <GigCard
              key={gig.id}
              id={gig.id}
              title={gig.title}
              photo={gig.photo}
              seller={gig.owner.user}
            />
          ))}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
