import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import palmtreesVideo from "../../assets/palmtreesVideo.mp4";
import GigCard from "../Gig/GigCard";
import Footer from "../footer/Footer";
import Searchbar from "../search/SearchBar";

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
      }}
    >
      <Searchbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Card style={{ height: "95vh" }}>
          <CardMedia
            component="video"
            image={palmtreesVideo}
            autoPlay
            loop
            muted
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
              bottom: "50%",
              left: "50%",
              transform: "translate(-50%, 50%)",
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Typography variant="h5" sx={{ paddingBottom: "20px" }}>
          Recent gigs
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {recentGigs.map((gig) => (
            <GigCard
              key={gig.id}
              title={gig.title}
              photo={gig.photo}
              seller={gig.owner.user}
              id={gig.id}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "5vh" }}>
        <Footer />
      </Box>
    </Box>
  );
}
