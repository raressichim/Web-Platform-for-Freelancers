import React from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import GigCard from "../Gig/GigCard";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Footer from "../footer/Footer";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useState, useEffect } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const SearchResults = () => {
  const location = useLocation();
  const { gigs } = location.state || { gigs: [] };

  const [allGigs, setAllGigs] = useState([]);

  useEffect(() => {
    const fetchAllGigs = async () => {
      try {
        const response = await fetch("http://localhost:8080/gig/getGigs");
        const data = await response.json();
        setAllGigs(data);
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };
    fetchAllGigs();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          width: "100%",
          flex: 1,
          bgcolor: "#E8E8E8",
          boxShadow: 3,
        }}
      >
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
          sx={{ pl: { sm: 2, md: 4 }, py: 2, alignSelf: "center" }}
        >
          <ReactRouterLink to="/">
            <HomeRoundedIcon />
          </ReactRouterLink>
          <Typography color="black" fontWeight={500} fontSize={14}>
            Search results
          </Typography>
        </Breadcrumbs>
        {!gigs.length && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: "3rem" }} />
            <Typography>No gigs found for your search.</Typography>
            <Typography sx={{ mt: 4 }}>See other gigs</Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                mt: 4,
              }}
            >
              {allGigs.map((gig) => (
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
        )}
        {gigs.length >= 4 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              mb: 4,
            }}
          >
            {gigs.map((gig) => (
              <GigCard
                key={gig.id}
                title={gig.title}
                photo={gig.photo}
                seller={gig.owner.user}
                id={gig.id}
              />
            ))}
          </Box>
        )}
        {gigs.length > 0 && gigs.length < 4 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                mb: 4,
              }}
            >
              {gigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  title={gig.title}
                  photo={gig.photo}
                  seller={gig.owner.user}
                  id={gig.id}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 6,
                mb: 4,
              }}
            >
              <Typography>See other gigs</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                mb: 4,
              }}
            >
              {allGigs
                .filter((gig) => !gigs.some((g) => g.id === gig.id))
                .map((gig) => (
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
        )}
      </Box>
      <Footer
        sx={{
          mt: 4,
        }}
      />
    </Box>
  );
};

export default SearchResults;
