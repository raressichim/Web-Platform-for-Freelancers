import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f4f4f4;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  max-width: 480px;
  width: 100%;
  margin: auto;
  padding: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  border-radius: 12px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  height: 48px;
  width: 120px;
`;

const PaymentForm = () => {
  const [step, setStep] = useState(1);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    errors: {},
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expDate: "",
    cvv: "",
    errors: {},
  });

  const location = useLocation();
  const orderData = location.state ? location.state.orderData : {};

  const [loading, setLoading] = useState(false);
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const TAX_PERCENTAGE = 12;
  const taxAmount = (orderData.price * TAX_PERCENTAGE) / 100;
  const totalPrice = orderData.price + taxAmount;

  const handleBillingChange = (key, value) => {
    const newBillingInfo = { ...billingInfo, [key]: value };
    newBillingInfo.errors[key] = validateBillingField(key, value);
    setBillingInfo(newBillingInfo);
  };

  const validateBillingField = (key, value) => {
    switch (key) {
      case "firstName":
      case "lastName":
      case "address":
      case "city":
      case "state":
        if (/\d/.test(value)) return "Invalid entry; numbers are not allowed.";
        break;
      case "zip":
        if (!/^\d{5}(-\d{4})?$/.test(value)) return "Invalid ZIP code.";
        break;
      default:
        return "";
    }
    return "";
  };

  const handlePaymentChange = (key, value) => {
    if (key === "expDate") {
      value = formatExpirationDate(value);
    }
    const newPaymentInfo = { ...paymentInfo, [key]: value };
    newPaymentInfo.errors[key] = validatePaymentField(key, value);
    setPaymentInfo(newPaymentInfo);
  };

  const formatExpirationDate = (value) => {
    if (value.length === 2 && paymentInfo.expDate.length === 1) {
      value += "/";
    }
    return value;
  };

  const validatePaymentField = (key, value) => {
    switch (key) {
      case "cardNumber":
        if (!/^\d{16}$/.test(value)) return "Invalid card number.";
        break;
      case "cardName":
        if (/\d/.test(value)) return "Invalid name on card.";
        break;
      case "expDate":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))
          return "Invalid expiration date.";
        const [month, year] = value.split("/").map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          return "Card is expired.";
        }
        break;
      case "cvv":
        if (!/^\d{3}$/.test(value)) return "Invalid CVV.";
        break;
      default:
        return "";
    }
    return "";
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateBillingInfo = () => {
    let errors = {};
    Object.entries(billingInfo).forEach(([key, value]) => {
      if (key !== "errors") {
        const error = validateBillingField(key, value);
        if (error) errors[key] = error;
      }
    });
    setBillingInfo({ ...billingInfo, errors });
    return Object.keys(errors).length === 0;
  };

  const validatePaymentInfo = () => {
    let errors = {};
    Object.entries(paymentInfo).forEach(([key, value]) => {
      if (key !== "errors") {
        const error = validatePaymentField(key, value);
        if (error) errors[key] = error;
      }
    });
    setPaymentInfo({ ...paymentInfo, errors });
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validatePaymentInfo()) {
      setLoading(true);
      console.log("Form Submitted:", { billingInfo, paymentInfo, orderData });
      try {
        const response = await fetch(`http://localhost:8080/order/addOrder`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...billingInfo,
            ...paymentInfo,
            ...orderData,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to place the order");
        }
        setTimeout(() => {
          setLoading(false);
          setPaymentAuthorized(true);
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }, 1000);
      } catch (error) {
        console.error("Error placing order:", error);
        setLoading(false);
      }
    }
  };

  const renderCheckoutInfo = () => (
    <CardContent>
      <Typography variant="h5" gutterBottom align="center">
        Checkout Information
      </Typography>
      <Box
        mt={3}
        p={2}
        bgcolor="#f9f9f9"
        borderRadius="8px"
        border="1px solid #ddd"
      >
        <Typography variant="subtitle1" align="center">
          Service Price: ${orderData.price.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" align="center">
          Tax (12%): ${taxAmount.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" align="center">
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
      </Box>
      <Grid container justifyContent="center">
        <StyledButton onClick={nextStep} variant="contained" color="primary">
          Next
        </StyledButton>
      </Grid>
    </CardContent>
  );

  const renderBillingInfo = () => (
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Billing Information
      </Typography>
      <form>
        <Grid container spacing={2}>
          {Object.entries(billingInfo).map(([key, value]) => {
            if (key !== "errors") {
              return (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    variant="outlined"
                    value={value}
                    onChange={(e) => handleBillingChange(key, e.target.value)}
                    error={!!billingInfo.errors[key]}
                    helperText={billingInfo.errors[key]}
                  />
                </Grid>
              );
            }
            return null;
          })}
          <Grid item xs={12} container justifyContent="space-between">
            <StyledButton onClick={prevStep} variant="contained">
              Back
            </StyledButton>
            <StyledButton
              onClick={nextStep}
              variant="contained"
              color="primary"
            >
              Next
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );

  const renderPaymentInfo = () => (
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Payment Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.entries(paymentInfo).map(([key, value]) => {
            if (key !== "errors") {
              return (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    variant="outlined"
                    value={value}
                    onChange={(e) => handlePaymentChange(key, e.target.value)}
                    error={!!paymentInfo.errors[key]}
                    helperText={paymentInfo.errors[key]}
                  />
                </Grid>
              );
            }
            return null;
          })}
          <Grid item xs={12} container justifyContent="space-between">
            <StyledButton onClick={prevStep} variant="contained">
              Back
            </StyledButton>
            {loading ? (
              <CircularProgress />
            ) : paymentAuthorized ? (
              <Typography>Payment authorized!</Typography>
            ) : (
              <StyledButton type="submit" variant="contained" color="primary">
                Pay
              </StyledButton>
            )}
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderCheckoutInfo();
      case 2:
        return renderBillingInfo();
      case 3:
        return renderPaymentInfo();
      default:
        return null;
    }
  };

  return (
    <Container>
      <StyledCard>{renderStep()}</StyledCard>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Payment successfully authorized!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Container>
  );
};

export default PaymentForm;
