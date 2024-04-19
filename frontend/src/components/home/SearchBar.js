import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Card from "@mui/material/Card";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import palmtreesVideo from "../../assets/palmtreesVideo.mp4";
import GigCard from "./GigCard";
import Container from "@mui/material/Container";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[300], 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[300], 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "auto",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "950px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      ITFreelancers {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Footer = styled("footer")({
  backgroundColor: "#f5f5f5",
  color: "#333",
  textAlign: "center",
  padding: "20px",
  position: "sticky",
  bottom: 0,
  width: "100%",
});

export default function SearchBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { loggedInUser, logout } = useUser();
  let navigate = useNavigate();
  const [recentGigs, setRecentGigs] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const SERVER = "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedInUser) {
          const response = await fetch(
            `${SERVER}/seller/check/${loggedInUser.id}`
          );
          const data = await response.json();
          setIsSeller(data);
        }
      } catch (error) {
        console.error("Error fetching seller status:", error);
      }
    };

    fetchData();
  }, [loggedInUser]);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      MenuListProps={{ onMouseLeave: handleMenuClose }}
      PaperProps={{
        style: {
          marginTop: "8px",
          marginLeft: "14px",
        },
      }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link
          to={!isSeller ? "/userProfile" : "/profile"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Profile
        </Link>
      </MenuItem>
      {isSeller && (
        <Link
          to={"/yourGigs"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem>Your gigs</MenuItem>
        </Link>
      )}
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            ITFreelancers
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {loggedInUser && !isSeller && (
              <Link to={"/becomeSeller"}>
                <Button
                  variant="outlined"
                  style={{
                    height: "30px",
                    width: "160px",
                    margin: "8px",
                  }}
                  aria-label="Become a seller"
                  sx={{
                    mt: 3,
                    mb: 2,
                    color: "black",
                    borderColor: "black",
                    backgroundColor: "white",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                  }}
                >
                  Become a seller
                </Button>
              </Link>
            )}
            {loggedInUser && isSeller && (
              <Link to={"/sellerBoard"}>
                <Button
                  variant="outlined"
                  aria-label="Switch to selling"
                  style={{
                    height: "30px",
                    width: "170px",
                    margin: "8px",
                  }}
                  sx={{
                    mt: 3,
                    mb: 2,
                    color: "black",
                    borderColor: "black",
                    backgroundColor: "white",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                  }}
                >
                  Switch to selling
                </Button>
              </Link>
            )}
            {!loggedInUser && (
              <Link to={"/login"}>
                <Button
                  variant="outlined"
                  aria-label="Log in"
                  style={{
                    height: "30px",
                    width: "110px",
                    margin: "8px",
                  }}
                  sx={{
                    mt: 3,
                    mb: 2,
                    color: "black",
                    borderColor: "black",
                    backgroundColor: "white",
                    transition: "background-color 0.3s, color 0.3s",
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                  }}
                >
                  Log In
                </Button>
              </Link>
            )}

            {loggedInUser && (
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
              >
                <NotificationsIcon />
                <span
                  style={{
                    backgroundColor: "red",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    marginLeft: 8,
                  }}
                />
              </IconButton>
            )}
            {loggedInUser && (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onMouseOver={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Card style={{ height: "95vh" }}>
          <CardMedia
            component="video"
            image={palmtreesVideo}
            autoPlay
            loop
            muted
          />
          <Typography
            variant="h4"
            component="div"
            sx={{
              position: "absolute",
              textAlign: "center",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "10px",
              borderRadius: "5px",
              bottom: "50%",
              left: "50%",
              transform: "translate(-50%, 50%)",
            }}
          >
            Service for freelancers
            <br />
            Work anytime anywhere
          </Typography>
        </Card>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Typography variant="h5" sx={{ paddingBottom: "20px" }}>
          Recent gigs
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {recentGigs.map((gig) => (
            <GigCard
              key={gig.id}
              title={gig.title}
              photo={gig.photo}
              seller={gig.owner.user.username}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "5vh" }}>
        <Footer>
          <Container maxWidth="sm">
            <Copyright />
          </Container>
        </Footer>
      </Box>
    </Box>
  );
}
