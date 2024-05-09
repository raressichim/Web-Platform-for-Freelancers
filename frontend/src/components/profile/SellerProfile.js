import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, color: "gray" }}>
          No reviews yet.
        </Typography>
      );
    }

    return (
      <Card
        sx={{
          border: "1px solid #ccc",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "16px",
          bgcolor: "#fafafa",
        }}
      >
        <Typography
          level="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Seller Reviews
        </Typography>
        {sellerReviews.map((review, index) => (
          <Box key={index} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#666" }}
            >
              Rating: {review.rating} / 10
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, color: "#444" }}>
              "{review.description}"
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1, color: "gray" }}
            >
              Added by {review.client.username}
            </Typography>
          </Box>
        ))}
      </Card>
    );
  };

  return (
    <Box sx={{ flex: 1, width: "100%", bgcolor: "#f9f9f9" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "white",
          zIndex: 999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon />}
          sx={{ p: 3 }}
        >
          <ReactRouterLink
            to="/"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <HomeRoundedIcon color="primary" />
          </ReactRouterLink>
          <Typography color="text.primary" fontWeight={600}>
            Seller Profile
          </Typography>
        </Breadcrumbs>
      </Box>
      <Stack spacing={4} sx={{ maxWidth: "800px", mx: "auto", px: 3, py: 4 }}>
        <ProfileCard
          title="Seller Info"
          fields={[
            { label: "Name", value: seller?.user?.name },
            { label: "Username", value: seller?.user?.username },
            { label: "Email", value: seller?.user?.email },
          ]}
        />
        <ProfileCard title="Bio" text={bioText} />
        <ProfileCard title="Education" text={educationText} />
        <ProfileCard title="Skills" text={skillsText} />

        <SellerReviewsSection />
      </Stack>
      <Footer />
    </Box>
  );
}

function ProfileCard({ title, fields, text }) {
  return (
    <Card
      sx={{
        border: "1px solid #ccc",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "16px",
        padding: 3,
        bgcolor: "white",
      }}
    >
      <Typography
        level="h6"
        sx={{ mb: 2, fontWeight: "medium", color: "#333" }}
      >
        {title} {text && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <Divider />
      {fields ? (
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{ my: 2 }}
        >
          {fields.map((field, idx) => (
            <Box key={idx} sx={{ flexGrow: 1 }}>
              <FormLabel sx={{ color: "#666" }}>{field.label}</FormLabel>
              <Typography sx={{ color: "#444" }}>{field.value}</Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Textarea
          size="sm"
          minRows={4}
          sx={{ mt: 1.5 }}
          value={text}
          readOnly
        />
      )}
    </Card>
  );
}
