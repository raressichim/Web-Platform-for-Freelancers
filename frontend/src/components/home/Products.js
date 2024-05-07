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
  MenuItem,
  Select,
  Tooltip,
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
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Footer from "../footer/Footer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

function ProductsBoard() {
  const [orders, setOrders] = useState([]);
  const { loggedInUser } = useUser();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState("");

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
          `http://localhost:8080/order/getMyProducts/${loggedInUser.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const productsData = await response.json();
        const gigsPromises = productsData.map((order) =>
          fetch(`http://localhost:8080/gig/getGig/${order.gig.id}`)
        );

        const gigsResponses = await Promise.all(gigsPromises);
        const gigsData = await Promise.all(
          gigsResponses.map((res) => res.json())
        );

        const reviewCheckPromises = productsData.map((order) =>
          fetch(
            `http://localhost:8080/review/hasReview/${loggedInUser.id}/${order.id}`
          )
        );

        const reviewCheckResponses = await Promise.all(reviewCheckPromises);
        const reviewStatuses = await Promise.all(
          reviewCheckResponses.map((res) => res.json())
        );

        const productsWithGigs = productsData.map((order, index) => ({
          ...order,
          gig: gigsData[index],
          canReview:
            reviewStatuses[index].message === "Client can review this order.",
        }));

        setOrders(productsWithGigs);
      } catch (error) {
        console.error("Error fetching orders or gigs:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [loggedInUser.id]);

  const submitReview = async () => {
    if (!reviewRating || !reviewContent.trim()) {
      alert("Please complete both the review and the rating.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/review/addReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: reviewContent,
          rating: reviewRating,
          gig: currentOrder.gig,
          client: currentOrder.client,
          seller: currentOrder.seller,
          order: currentOrder,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const updatedOrders = orders.map((order) => {
        if (order.id === currentOrder.id) {
          return { ...order, canReview: false };
        }
        return order;
      });

      setOrders(updatedOrders);

      setIsReviewDialogOpen(false);
      setReviewContent("");
      setReviewRating("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleFileDownload = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/order/getFile/${orderId}`
      );
      if (!response.ok) {
        throw new Error("Failed to download file.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const order = orders.find((order) => order.id === orderId);
      const filename = order.fileName || "downloaded-file";

      const filenameWithExtension = filename.endsWith(".zip")
        ? filename
        : `${filename}.zip`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filenameWithExtension;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Could not download the file.");
    }
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
            My products
          </Typography>
        </Breadcrumbs>
      </Box>
      {orders.length <= 0 && (
        <ReactRouterLink to="/">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginTop: "20vh",
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: "3rem" }} />
            <Typography sx={{ fontSize: "1.5rem" }}>
              You haven't bought anything {<br />} Search and go buy some!
            </Typography>
          </Box>
        </ReactRouterLink>
      )}
      {orders.length > 0 && (
        <Container sx={{ mt: 4 }}>
          <h1>Products History</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Gig</TableCell>
                  <TableCell align="right">Seller</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row">
                      <ReactRouterLink to={`/gig/${order.gig?.id}`}>
                        {order.gig?.title || "Loading gig details..."}
                      </ReactRouterLink>
                    </TableCell>
                    <TableCell align="right">
                      {order.seller.user.username || "Unknown seller"}
                    </TableCell>
                    <TableCell align="right">{order.status}</TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => handleOpenPopup(order.description)}
                      >
                        View Description
                      </Button>
                    </TableCell>
                    <TableCell align="right">
                      {order.seller.user.email}
                    </TableCell>
                    <TableCell align="right">
                      {order.status === "Resolved" && order.canReview && (
                        <Button
                          onClick={() => {
                            setIsReviewDialogOpen(true);
                            setCurrentOrder(order);
                          }}
                          aria-label="add review"
                        >
                          + Add Review
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {order.fileName ? (
                        <IconButton
                          onClick={() => handleFileDownload(order.id)}
                          color="primary"
                        >
                          <FileDownloadOutlinedIcon />
                        </IconButton>
                      ) : (
                        <Tooltip
                          title="Your download option will be available when the freelancer uploads the file"
                          placement="top"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                fontSize: "1.1rem",
                              },
                            },
                          }}
                        >
                          <IconButton>
                            <InfoOutlinedIcon color="action" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      )}
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
      <Dialog
        open={isReviewDialogOpen}
        onClose={() => {
          setIsReviewDialogOpen(false);
          setReviewContent("");
          setReviewRating("");
        }}
        aria-labelledby="review-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "250px",
            minWidth: "400px",
            maxWidth: "70%",
            width: "auto",
          },
        }}
      >
        <DialogTitle id="review-dialog-title">
          Submit Review
          <IconButton
            aria-label="close"
            onClick={() => {
              setIsReviewDialogOpen(false);
              setReviewContent("");
              setReviewRating("");
            }}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            variant="outlined"
            placeholder="Write your review here..."
            margin="normal"
          />
          <Select
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            displayEmpty
            fullWidth
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              Rate from 1 to 10
            </MenuItem>
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={submitReview}
            color="primary"
            variant="contained"
            disabled={!reviewContent.trim() || !reviewRating}
            sx={{ mt: 2, width: "100%" }}
          >
            Submit Review
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
}

export default ProductsBoard;
