import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GigCard from "./GigCard";
import Footer from "../footer/Footer";
import { useUser } from "../context/UserContext";
import CloseIcon from "@mui/icons-material/Close";

const GigDetails = () => {
  const { gigId } = useParams();
  const [yourGigs, setYourGigs] = useState(null);
  const [gig, setGig] = useState(null);
  const [recentGigs, setRecentGigs] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [orderData, setOrderData] = useState({});
  const { loggedInUser } = useUser();
  const SERVER = "http://localhost:8080";
  const [description, setDescription] = useState("");

  const handleBuyClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handlePay = async () => {
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

      if (!response.ok) {
        console.log("Failed to order");
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
      if (response.ok) {
        setGig(data);
        setOrderData({
          seller: data.owner,
          client: loggedInUser,
          gig: gig,
        });
      }
    };

    fetchGigDetails();
  }, [gig, gigId, loggedInUser]);

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
    <Box sx={{ flexGrow: 1 }}>
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
                  "&:hover": { backgroundColor: "white", color: "black" },
                }}
              >
                Buy service
              </Button>
              <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                aria-labelledby="buy-dialog-title"
                sx={{
                  "& .MuiDialog-paper": {
                    minHeight: "200px",
                    minWidth: "500px",
                    maxWidth: "70%",
                    width: "auto",
                  },
                }}
              >
                <DialogTitle id="buy-dialog-title">
                  Confirm Purchase
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                  />
                  <Button
                    onClick={() => handlePay(orderData.description)}
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Confirm
                  </Button>
                </DialogContent>
              </Dialog>
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
