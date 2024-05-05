import React from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useUser } from "../context/UserContext";
import { Link as ReactRouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";
import Footer from "../footer/Footer";

function SellerBoard() {
  const [orders, setOrders] = useState([]);
  const [seller, setSeller] = useState({});
  const { loggedInUser } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");

  const handleOpenPopup = (description) => {
    setCurrentDescription(description);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/order/getOrders/${seller.id}`
        );

        if (!response.ok) {
          console.log("Failed to fetch orders");
        }

        const ordersData = await response.json();
        const gigsPromises = ordersData.map((order) =>
          fetch(`http://localhost:8080/gig/getGig/${order.gig.id}`)
        );

        const gigsResponses = await Promise.all(gigsPromises);
        const gigsData = await Promise.all(
          gigsResponses.map((res) => res.json())
        );

        const ordersWithGigs = ordersData.map((order, index) => ({
          ...order,
          gig: gigsData[index],
        }));

        setOrders(ordersWithGigs);
      } catch (error) {
        console.error("Error fetching orders or gigs:", error);
        setOrders([]);
      }
    };

    if (seller.id) {
      fetchOrders();
    }
  }, [seller.id]);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/seller/getSeller/${loggedInUser.id}`
        );
        const data = await response.json();
        setSeller(data);
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };
    fetchSeller();
  }, [loggedInUser.id]);

  useEffect(() => {
    const fetchRecentGigs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/order/getOrders/${seller.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching recent gigs:", error);
      }
    };

    if (seller.id) {
      fetchRecentGigs();
    }
  }, [seller.id]);

  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;
    // Update locally for instant UI feedback
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);

    try {
      const response = await fetch(
        `http://localhost:8080/order/updateStatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      revertStatusUpdate(orderId);
    }
  };

  const revertStatusUpdate = (orderId) => {
    const revertedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: order.prevStatus };
      }
      return order;
    });
    setOrders(revertedOrders);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
            My orders
          </Typography>
        </Breadcrumbs>
      </Box>
      <Container sx={{ mt: 4 }}>
        <h1>Manage Orders</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gig</TableCell>
                <TableCell align="right">Buyer</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row">
                      <ReactRouterLink to={`/gig/${order.gig?.id}`}>
                        {order.gig?.title || "Loading gig details..."}
                      </ReactRouterLink>
                    </TableCell>
                    <TableCell align="right">
                      {order.client.username || "Unknown buyer"}
                    </TableCell>
                    <TableCell align="right">
                      <Select
                        labelId="status-label"
                        id="status-select"
                        value={order.status}
                        label="Status"
                        onChange={(event) =>
                          handleStatusChange(event, order.id)
                        }
                        sx={{ width: 140 }}
                      >
                        <MenuItem value="In progress">In progress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleOpenPopup(order.description)}
                      >
                        View Description
                      </Button>
                    </TableCell>
                    <TableCell align="right">{order.client.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Dialog
        open={isPopupOpen}
        onClose={handleClosePopup}
        aria-labelledby="description-dialog"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "200px",
            minWidth: "400px",
            maxWidth: "70%",
            width: "auto",
          },
        }}
      >
        <DialogTitle id="description-dialog">
          Order Description
          <IconButton
            aria-label="close"
            onClick={handleClosePopup}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            value={currentDescription}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
}

export default SellerBoard;
