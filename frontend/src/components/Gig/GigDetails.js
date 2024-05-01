import React from "react";
import { Box, Grid, Typography, Button, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GigCard from "./GigCard";
import Footer from "../footer/Footer";
import PopUp from "./DescPopUp";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const GigDetails = () => {
  const { gigId } = useParams();
  const [yourGigs, setYourGigs] = useState(null);
  const [gig, setGig] = useState(null);
  const [recentGigs, setRecentGigs] = useState(null);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [orderData, setOrderData] = useState({});
  const navigate = useNavigate();
  const { loggedInUser } = useUser();
  const SERVER = "http://localhost:8080";

  const handleBuyClick = () => {
    document.body.style.overflow = "hidden";
    setPopUpOpen(true);
  };

  const handleClose = () => {
    document.body.style.overflow = "unset";
    setPopUpOpen(false);
  };

  const handlePay = async (description) => {
    const updatedOrderData = {
      ...orderData,
      description: description,
    };

    try {
      const response = await fetch(`${SERVER}/order/addOrder`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrderData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("Failed to place the order");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      handleClose();
    }
  };

  useEffect(() => {
    const fetchRecentGigs = async () => {
      try {
        const response = await fetch("http://localhost:8080/gig/getGigs");
        const data = await response.json();
        setRecentGigs(data);
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };
    fetchRecentGigs();
  }, []);

  useEffect(() => {
    const fetchGigDetails = async () => {
      const response = await fetch(`http://localhost:8080/gig/getGig/${gigId}`);
      const data = await response.json();
      setGig(data);
      if (response.ok) {
        setOrderData({
          description: "",
          seller: data.owner,
          client: loggedInUser,
        });
      }
    };

    fetchGigDetails();
  }, [gigId, loggedInUser]);

  useEffect(() => {
    const fetchGigs = async () => {
      if (gig && gig.owner && gig.owner.user) {
        try {
          const response = await fetch(
            `http://localhost:8080/gig/getYourGigs/${gig.owner.user.id}`
          );
          const data = await response.json();
          setYourGigs(data);
        } catch (error) {
          console.error("Error fetching recent gigs:", error);
        }
      }
    };

    if (gig) {
      fetchGigs();
    }
  }, [gig]);

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
              Offered by{" "}
              <Link
                to={`/sellerProfile/${gig.owner?.user?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {gig.owner?.user?.username}
              </Link>
            </Typography>
            <Typography gutterBottom sx={{ my: 2 }}>
              {gig.owner?.description}
            </Typography>
            <Typography variant="h5" color="secondary" gutterBottom>
              ${gig.price}
            </Typography>
            <Typography>
              Contact info: <br /> email: {gig.owner.user.email}
            </Typography>
          </Box>
          {loggedInUser.id !== gig.owner.user.id && (
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleBuyClick}
                sx={{
                  mt: 3,
                  mb: 2,
                  color: "white",
                  borderColor: "#000",
                  backgroundColor: "black",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                  },
                }}
              >
                Buy service
              </Button>
              <PopUp
                open={isPopUpOpen}
                onClose={handleClose}
                onSubmit={handlePay}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            About this gig
          </Typography>
          <Typography>{gig.description}</Typography>
        </Grid>
        <Grid item xs={12}>
          {yourGigs && yourGigs.length > 1 ? (
            <>
              <Typography>
                See other gigs from {gig.owner?.user?.username}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                  mt: 2,
                }}
              >
                {yourGigs
                  .filter((otherGig) => gig.id !== otherGig.id)
                  .map((otherGig) => (
                    <GigCard
                      key={otherGig.id}
                      title={otherGig.title}
                      photo={otherGig.photo}
                      seller={otherGig.owner.user}
                      id={otherGig.id}
                    />
                  ))}
              </Box>
            </>
          ) : recentGigs ? (
            <>
              <Typography>Check other gigs</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                {recentGigs
                  .filter((otherGig) => gig && gig.id !== otherGig.id)
                  .map((otherGig) => (
                    <GigCard
                      key={otherGig.id}
                      title={otherGig.title}
                      photo={otherGig.photo}
                      seller={otherGig.owner.user}
                      id={otherGig.id}
                    />
                  ))}
              </Box>
            </>
          ) : (
            <Typography>Loading other gigs...</Typography>
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default GigDetails;
