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

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "background.body",
          zIndex: 9995,
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
            <Typography color="black" fontWeight={500} fontSize={12}>
              Seller Profile
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Seller info</Typography>
          </Box>
          <Divider />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ my: 1 }}
          >
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Name</FormLabel>
              <Typography>{seller ? seller.user.name : ""}</Typography>
            </Stack>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Username</FormLabel>
              <Typography>{seller ? seller.user.username : ""}</Typography>
            </Stack>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Typography>{seller ? seller.user.email : ""}</Typography>
            </Stack>
          </Stack>
        </Card>

        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">
              {" "}
              <span style={{ color: "red" }}>*</span> Bio
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea size="sm" minRows={4} sx={{ mt: 1.5 }} value={bioText} />
          </Stack>
        </Card>
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0,0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">
              {" "}
              <span style={{ color: "red" }}>*</span>Education
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={educationText}
            />
          </Stack>
        </Card>
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.7)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">
              {" "}
              <span style={{ color: "red" }}>*</span>Skills
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={skillsText}
            />
          </Stack>
        </Card>
      </Stack>
      <Footer />
    </Box>
  );
}
