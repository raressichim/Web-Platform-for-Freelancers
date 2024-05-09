import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Textarea from "@mui/joy/Textarea";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useUser } from "../context/UserContext";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Footer from "../footer/Footer";

export default function Profile() {
  const { loggedInUser } = useUser();
  const [bioLength, setBioLength] = useState(null);
  const [bioText, setBioText] = useState("");
  const [educationLength, setEducationLength] = useState(null);
  const [educationText, setEducationText] = useState("");
  const [skillsLength, setSkillsLength] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(null);
  const SERVER = "http://localhost:8080";
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(
          `${SERVER}/seller/getSeller/${loggedInUser.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setBioText(data.description);
          setEducationText(data.education);
          setSkillsText(data.skills);
        } else {
          setError("Failed to fetch seller data");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("An error occurred while fetching seller data");
      }
    };

    fetchSellerData();
  }, [loggedInUser.id]);

  const handleBioChange = (event) => {
    const newText = event.target.value;
    setBioText(newText);
    setBioLength(1000 - newText.length);
  };

  const handleEducationChange = (event) => {
    const newText = event.target.value;
    setEducationText(newText);
    setEducationLength(350 - newText.length);
  };

  const handleSkillsChange = (event) => {
    const newText = event.target.value;
    setSkillsText(newText);
    setSkillsLength(255 - newText.length);
  };

  let navigate = useNavigate();

  const handleSave = async (event) => {
    if (
      bioText.length <= 0 ||
      educationText <= 0 ||
      skillsText <= 0 ||
      bioText == null ||
      educationText == null ||
      skillsText == null
    ) {
      setError("All the fields must be completed");
      setIsClicked(true);
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/seller/update/${loggedInUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              description: bioText,
              education: educationText,
              skills: skillsText,
            }),
          }
        );
        if (response.ok) {
          navigate("/");
        } else {
          setError("Failed to update your new data. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred");
      }
    }
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
            <Typography color="black" fontWeight={500} fontSize={12}>
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
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
            <Typography level="title-md">Personal info</Typography>
          </Box>
          <Divider />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ my: 1 }}
          >
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Name</FormLabel>
              <Typography>{loggedInUser ? loggedInUser.name : ""}</Typography>
            </Stack>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Username</FormLabel>
              <Typography>
                {loggedInUser ? loggedInUser.username : ""}
              </Typography>
            </Stack>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              <Typography>{loggedInUser ? loggedInUser.email : ""}</Typography>
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
            <Typography level="body-sm">
              Write a short introduction to be displayed on your profile
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              placeholder="Example: I'm an experienced IT professional specializing in web, mobile, and software development. With a focus on quality, timely delivery, and clear communication, I'm here to help you bring your digital projects to life."
              value={bioText}
              onChange={handleBioChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!bioLength && <p>1000 characters left</p>}
              {bioLength >= 0 && <p>{bioLength} characters left</p>}
              {bioLength < 0 && (
                <p style={{ color: "red" }}>Maximum characters limit reached</p>
              )}
            </FormHelperText>
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
            <Typography level="body-sm">
              Write about your studies in order to be displayed on your profile.
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              placeholder="HighSchool, University, etc."
              value={educationText}
              onChange={handleEducationChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!educationLength && <p>350 characters left</p>}
              {educationLength >= 0 && <p>{educationLength} characters left</p>}
              {educationLength < 0 && (
                <p style={{ color: "red" }}>Maximum characters limit reached</p>
              )}
            </FormHelperText>
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
            <Typography level="body-sm">
              Share your most important skills separated by ',' .
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              placeholder="JAVA, OOP, C, React, etc."
              value={skillsText}
              onChange={handleSkillsChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!skillsLength && <p>255 characters left</p>}
              {skillsLength >= 0 && <p>{skillsLength} characters left</p>}
              {skillsLength < 0 && (
                <p style={{ color: "red" }}>Maximum characters limit reached</p>
              )}
            </FormHelperText>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ display: "flex", alignItems: "center" }}>
              {isClicked && error && (
                <p style={{ color: "red", marginRight: "auto" }}>{error}</p>
              )}
              <Button
                size="sm"
                variant="solid"
                sx={{
                  color: "#000",
                  borderColor: "#000",
                  backgroundColor: "#fff",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    backgroundColor: "#000",
                    color: "#fff",
                  },
                }}
                onClick={handleSave}
              >
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
      <Footer />
    </Box>
  );
}
