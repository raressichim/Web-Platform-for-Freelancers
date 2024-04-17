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
import { useState, useRef } from "react";

export default function SellerDashboard() {
  const { loggedInUser } = useUser();
  const [titleLength, setTitleLength] = useState(null);
  const [titleText, setTitleText] = useState("");
  const [bioLength, setBioLength] = useState(null);
  const [bioText, setBioText] = useState("");
  const [tagsLength, setTagsLength] = useState(null);
  const [tagsText, setTagsText] = useState("");
  const [priceLength, setPriceLength] = useState(null);
  const [priceText, setPriceText] = useState("");
  const [error, setError] = useState(null);
  const [isClicked, setIsClicked] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTitleChange = (event) => {
    const newText = event.target.value;
    setTitleText(newText);
    setTitleLength(100 - newText.length);
  };

  const handleBioChange = (event) => {
    const newText = event.target.value;
    setBioText(newText);
    setBioLength(500 - newText.length);
  };

  const handleTagsChange = (event) => {
    const newText = event.target.value;
    setTagsText(newText);
    setTagsLength(350 - newText.length);
  };

  const handlePriceChange = (event) => {
    const newText = event.target.value;
    setPriceText(newText);
    setPriceLength(10 - newText.length);
  };

  const handlePhotoChange = () => {
    const file = fileInputRef.current.files[0];
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };
  const SERVER = "http://localhost:8080";
  const userId = loggedInUser.id;
  let navigate = useNavigate();
  const handleSave = async (event) => {
    const price = parseFloat(priceText);
    if (isNaN(price)) {
      setError("Price must be a valid number");
      setIsClicked(true);
      return;
    }
    if (
      titleText.length <= 0 ||
      bioText.length <= 0 ||
      tagsText <= 0 ||
      priceText <= 0 ||
      titleText == null ||
      bioText == null ||
      tagsText == null ||
      priceText == null
    ) {
      setError("All the fields must be completed");
      setIsClicked(true);
    } else {
      const formData = new FormData();
      formData.append("title", titleText);
      formData.append("tags", tagsText);
      formData.append("price", priceText);
      formData.append("description", bioText);
      formData.append("photo", selectedFile);

      try {
        const response = await fetch(`${SERVER}/gig/addGig/${userId}`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          navigate("/");
        } else {
          setError("Error ecountered");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred");
      }
    }
  };

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
              Selling menu
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            Sell a new gig
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
        <p style={{ color: "red" }}>
          Complete every field in order to start selling this gig.
        </p>

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
              <span style={{ color: "red" }}>*</span> Title
            </Typography>
            <Typography level="body-sm">
              Upload a photo to be displayed on your gig's card.
            </Typography>
          </Box>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />
          {selectedFile && (
            <Typography level="body-sm" sx={{ mb: 1 }}>
              File selected: {fileInputRef.current.files[0].name}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
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
            onClick={handleChooseFile}
          >
            {selectedFile ? "Change Photo" : "Choose Photo"}
          </Button>
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
              <span style={{ color: "red" }}>*</span> Title
            </Typography>
            <Typography level="body-sm">Give your gig a title.</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={2}
              sx={{ mt: 1.5 }}
              placeholder="Example: Web Logo"
              value={titleText}
              onChange={handleTitleChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!titleLength && <p>100 characters left</p>}
              {titleLength >= 0 && <p>{titleLength} characters left</p>}
              {titleLength < 0 && (
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
              <span style={{ color: "red" }}>*</span> Description
            </Typography>
            <Typography level="body-sm">
              Write a short introduction of your new service.
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              placeholder="Example: Need top-notch IT solutions? Look no further! I offer expert services including website development, software solutions, cybersecurity consultation, cloud management, IT infrastructure, and consulting."
              value={bioText}
              onChange={handleBioChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!bioLength && <p>500 characters left</p>}
              {bioLength >= 0 && <p>{bioLength} characters left</p>}
              {bioLength < 0 && (
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
              <span style={{ color: "red" }}>*</span>Tags
            </Typography>
            <Typography level="body-sm">
              Write the tags that best suit your gig. Note that these will be
              the tags by which the service will be identified.
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              placeholder="Example: Web Developing, Java, React, etc."
              value={tagsText}
              onChange={handleTagsChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!tagsLength && <p>350 characters left</p>}
              {tagsLength >= 0 && <p>{tagsLength} characters left</p>}
              {tagsLength < 0 && (
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
              <span style={{ color: "red" }}>*</span>Price
            </Typography>
            <Typography level="body-sm">
              Set a price in euros for your service.
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={2}
              sx={{ mt: 1.5 }}
              placeholder="Example: 100"
              value={priceText}
              onChange={handlePriceChange}
            />
            <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
              {!priceLength && <p>10 characters left</p>}
              {priceLength >= 0 && <p>{priceLength} characters left</p>}
              {priceLength < 0 && (
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
    </Box>
  );
}
