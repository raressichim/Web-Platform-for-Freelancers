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
import Image from "mui-image";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import palmtreesImage from "../../assets/palmtrees.jpg";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
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

export default function SearchBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { loggedInUser } = useUser();
  const { logout } = useUser();
  let navigate = useNavigate();

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
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
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
                    color: "black",
                    borderColor: "black",
                    height: "30px",
                    width: "160px",
                    margin: "8px",
                  }}
                >
                  Become a seller
                </Button>
              </Link>
            )}
            {!loggedInUser && (
              <Link to={"/login"}>
                <Button
                  variant="outlined"
                  style={{
                    color: "black",
                    borderColor: "black",
                    height: "30px",
                    width: "110px",
                    margin: "8px",
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
          height: "50vh",
        }}
      >
        <div style={{ width: "100%" }}>
          <Image src={palmtreesImage} alt="A descriptive alt text" />
        </div>
      </Box>
    </Box>
  );
}
