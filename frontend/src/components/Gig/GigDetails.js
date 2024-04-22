import React from "react";
import { Box, Grid, Typography, Button, CardMedia, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

const GigDetails = () => {
  const { gigId } = useParams();
  const [gig, setGig] = useState(null);

  useEffect(() => {
    const fetchGigDetails = async () => {
      const response = await fetch(`http://localhost:8080/gig/getGig/${gigId}`);
      const data = await response.json();
      setGig(data);
    };

    fetchGigDetails();
  }, [gigId]);

  if (!gig) {
    return <div>Loading...</div>;
  }

  const imageSrc = "data:image/jpeg;base64," + gig.photo;

  return (
    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="sm" />}
        sx={{ mb: 2 }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <HomeRoundedIcon />
        </Link>
        <Typography color="text.primary" fontWeight={500}>
          Gig Details
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={4} sx={{ px: 4 }}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "auto", borderRadius: 2 }}
            image={imageSrc}
            alt={gig.title}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {gig.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
              Offered by {gig.owner?.user?.username}
            </Typography>
            <Typography gutterBottom sx={{ my: 2 }}>
              {gig.owner?.description}
            </Typography>
            <Typography variant="h5" color="secondary" gutterBottom>
              ${gig.price}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Add To Cart
            </Button>
            <Button variant="outlined" color="primary" size="large">
              Contact
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            About this gig
          </Typography>
          <Typography>{gig.description}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GigDetails;
