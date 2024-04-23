import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Card from "@mui/joy/Card";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useUser } from "../context/UserContext";
import { Link as ReactRouterLink } from "react-router-dom";

import Footer from "../footer/Footer";

export default function Profile() {
  const { loggedInUser } = useUser();

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
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            Personal Info
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
            border: "2px solid rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Name</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Typography>{loggedInUser ? loggedInUser.name : ""}</Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md"> Username</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Typography>{loggedInUser ? loggedInUser.username : ""}</Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            border: "2px solid rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            boxShadow: "none",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Email</Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Typography>{loggedInUser ? loggedInUser.email : ""}</Typography>
          </Stack>
        </Card>
      </Stack>
      <Footer />
    </Box>
  );
}
