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
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import GigCard from "./GigCard";
import Footer from "../footer/Footer";
import { useUser } from "../context/UserContext";
import CloseIcon from "@mui/icons-material/Close";
import palmtreesPhoto from "../../assets/palmtreesPhoto.jpg";

const TAX_PERCENTAGE = 12; // 12% tax

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
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

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
      totalPrice: gig.price + gig.price * (TAX_PERCENTAGE / 100),
    };
    if (!description.trim()) {
      return;
    }
    navigate("/pay", { state: { orderData: updatedOrderData } });
    handleClose();
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
          price: data.price,
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

  useEffect(() => {
    if (gigId) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(
            `${SERVER}/review/getGigReview/${gigId}`
          );
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }
  }, [gigId]);

  const ReviewsSection = () => {
    if (reviews.length === 0) {
      return (
        <Box sx={{ mt: 2, p: 2, bgcolor: "#ffffff", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Reviews
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            No reviews yet.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: "#ffffff", borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Reviews
        </Typography>
        {reviews.map((review, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              pt: 2,
              pb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "medium", color: "text.secondary" }}
            >
              Rating: {review.rating} / 10
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              "{review.description}"
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "text.secondary" }}
            >
              Added by {review.client.username}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  if (!gig) {
    return (
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </Typography>
    );
  }

  const imageSrc = gig ? "data:image/jpeg;base64," + gig.photo : palmtreesPhoto;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f4f4f9" }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="sm" />}
        sx={{ mb: 2, padding: "10px" }}
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
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "500px",
              objectFit: "contain",
              borderRadius: 2,
            }}
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
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: "1.8rem", color: "#333" }}
            >
              {gig.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: "1.2rem", color: "#555" }}
            >
              Offered by{" "}
              <Link
                to={`/sellerProfile/${gig.owner?.user?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {gig.owner?.user?.username}
              </Link>
            </Typography>
            <Typography sx={{ my: 2, fontSize: "1rem", color: "#666" }}>
              {gig.owner?.description}
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 500, fontSize: "1.5rem", color: "#e63946" }}
            >
              ${gig.price}
            </Typography>
            <Typography sx={{ color: "#666" }}>
              Contact info: <br /> email: {gig.owner.user.email}
            </Typography>
          </Box>
          {loggedInUser && loggedInUser.id !== gig.owner.user.id && (
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleBuyClick}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#000",
                  color: "white",
                  "&:hover": { backgroundColor: "#e63946" },
                }}
              >
                Buy service
              </Button>
              <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                sx={{
                  "& .MuiDialog-paper": {
                    borderRadius: 2,
                    padding: "20px",
                    minWidth: "500px",
                    boxShadow: "0px 8px 26px rgba(0,0,0,0.15)",
                  },
                }}
                aria-labelledby="buy-dialog-title"
              >
                <DialogTitle id="buy-dialog-title" sx={{ fontWeight: "bold" }}>
                  Tell the freelancer what you expect from them
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: "text.secondary",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2, borderColor: "primary.main" }}
                    placeholder="Describe your requirements here..."
                  />
                  <Button
                    onClick={() => handlePay(orderData.description)}
                    color="primary"
                    variant="contained"
                    sx={{
                      width: "100%",
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
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
          <Box sx={{ bgcolor: "#ffffff", borderRadius: 2, p: 2 }}>
            <ReviewsSection />
          </Box>
        </Grid>
        <Grid item xs={12}>
          {yourGigs && yourGigs.length > 1 ? (
            <>
              <Box>
                <Typography
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  See other gigs from {gig.owner?.user?.username}
                </Typography>
              </Box>
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
