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
} from "@mui/material";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useUser } from "../context/UserContext";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Footer from "../footer/Footer";

function SellerBoard() {
  const [orders, setOrders] = useState([]);
  const [seller, setSeller] = useState({});
  const { loggedInUser } = useUser();

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
          console.log(data);
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <h1>Manage Orders</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gig</TableCell>
                <TableCell align="right">Buyer</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell allign="right">Description</TableCell>
                <TableCell allign="right">Contact</TableCell>
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
                      {order.status || "In progress"}
                    </TableCell>
                    <TableCell allign="right">{order.description}</TableCell>
                    <TableCell>{order.seller.user.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </Box>
  );
}

export default SellerBoard;
