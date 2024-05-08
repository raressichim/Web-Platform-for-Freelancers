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
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { debounce } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[500], 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[600], 0.25),
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100ch",
    },
  },
}));

export default function Searchbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { loggedInUser, logout } = useUser();
  const [isSeller, setIsSeller] = useState(false);
  const SERVER = "http://localhost:8080";
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const fetchSuggestions = useCallback(
    debounce(async (text) => {
      if (!text.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${SERVER}/gig/autocompleteTags?prefix=${encodeURIComponent(text)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching autocomplete data:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    setSelectedIndex(-1);
    onSearch({ key: "Enter", target: { value: suggestion } });
  };

  const onSearch = async (event) => {
    if (event.key === "Enter" || event.type === "click") {
      const searchValue = event.target.value;
      if (!searchValue.trim()) return;
      try {
        const response = await fetch(
          `${SERVER}/gig/search?tags=${encodeURIComponent(searchValue)}`
        );
        const data = await response.json();
        navigate("/searchResults", { state: { gigs: data } });
      } catch (error) {
        console.error("Error during search:", error);
      }
    }
  };

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

  useEffect(() => {
    if (searchText.trim() !== "") {
      setLoading(true);
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText, fetchSuggestions]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

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
      sx={{
        marginTop: "8px",
        marginLeft: "14px",
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
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Search>
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "300px",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 3,
            zIndex: 9999,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            suggestions.map((suggestion, index) => (
              <Box
                key={index}
                component="button"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseLeave={() => setSelectedIndex(-1)}
                sx={{
                  width: "100%",
                  textAlign: "left",
                  background:
                    selectedIndex === index ? "rgba(0, 0, 0, 0.04)" : "none",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {suggestion}
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {loggedInUser && !isSeller && (
            <Link to={"/becomeSeller"}>
              <Button
                variant="outlined"
                style={{
                  height: "30px",
                  width: "175px",
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
                  width: "180px",
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
            <Link to="/myProducts">
              <IconButton
                size="large"
                edge="end"
                aria-label="products"
                aria-haspopup="true"
                color="inherit"
              >
                <LocalMallOutlinedIcon />
              </IconButton>
            </Link>
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
      {renderMenu}
    </AppBar>
  );
}
