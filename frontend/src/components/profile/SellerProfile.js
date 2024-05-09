import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Footer from "../footer/Footer";

export default function SellerProfile() {
  const [bioText, setBioText] = useState("");
  const [educationText, setEducationText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [seller, setSeller] = useState("");
  const SERVER = "http://localhost:8080";
  const [sellerReviews, setSellerReviews] = useState([]);
  const param = useParams();
  const sellerId = param.sellerId;

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(`${SERVER}/seller/getSeller/${sellerId}`);
        if (response.ok) {
          const data = await response.json();
          setBioText(data.description);
          setEducationText(data.education);
          setSkillsText(data.skills);
          setSeller(data);
        } else {
          console.log("Failed to fetch seller data");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      const fetchSellerReviews = async () => {
        try {
          const response = await fetch(
            `${SERVER}/review/getSellerReviews/${sellerId}`
          );
          if (response.ok) {
            const data = await response.json();
            setSellerReviews(data);
          } else {
            console.log("Failed to fetch seller reviews");
          }
        } catch (error) {
          console.error("Error fetching seller reviews:", error);
        }
      };

      fetchSellerReviews();
    }
  }, [sellerId]);

  const SellerReviewsSection = () => {
    if (sellerReviews.length === 0) {
      return (
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          No reviews yet.
        </Typography>
      );
    }

    return (
      <Card
        sx={{
          border: "2px solid rgba(0, 0, 0, 0.7)",
          borderRadius: "20px",
          boxShadow: "none",
          marginBottom: "16px",
        }}
      >
        <Typography level="title-md" gutterBottom sx={{ fontWeight: "bold" }}>
          Seller Reviews
        </Typography>
        {sellerReviews.map((review, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              pt: 2,
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
      </Card>
    );
  };

  return (
    <Box sx={{ flex: 1, width: "100%", backgroundColor: "#f0f0f0" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "#ffffff",
          zIndex: 9995,
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
            <Typography color="black" fontWeight={500} fontSize={14}>
              Seller Profile
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
            padding: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Seller Info
          </Typography>
          <Divider />
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Typography>
              <strong>Name:</strong> {seller ? seller.user.name : ""}
            </Typography>
            <Typography>
              <strong>Username:</strong> {seller ? seller.user.username : ""}
            </Typography>
            <Typography>
              <strong>Email:</strong> {seller ? seller.user.email : ""}
            </Typography>
          </Stack>
        </Card>

        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
            padding: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Bio
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }}>{bioText}</Typography>
        </Card>

        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
            padding: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Education
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }}>{educationText}</Typography>
        </Card>

        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
            padding: "20px",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Skills
          </Typography>
          <Divider />
          <Typography sx={{ mt: 2 }}>{skillsText}</Typography>
        </Card>

        <SellerReviewsSection />
      </Box>
      <Footer />
    </Box>
  );
}
