import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
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
`;

const StyledCard = styled(Card)`
  max-width: 480px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

function PaymentForm() {
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
  const navigate = useNavigate();

  function hasNumbers(t) {
    return /\d/.test(t);
  }

  function isValidZip(zip) {
    return /^\d{5}(-\d{4})?$/.test(zip);
  }

  function isValidCardNumber(number) {
    return number.length === 16 && /^\d+$/.test(number);
  }

  function isValidCVV(cvv) {
    return /^\d{3}$/.test(cvv);
  }

  // Validate fields immediately as they are updated
  function handleBillingChange(key, value) {
    const newBillingInfo = { ...billingInfo, [key]: value };
    newBillingInfo.errors[key] = validateBillingField(key, value);
    setBillingInfo(newBillingInfo);
  }

  function validateBillingField(key, value) {
    switch (key) {
      case "firstName":
      case "lastName":
      case "address":
      case "city":
      case "state":
        if (hasNumbers(value)) return "Invalid entry; numbers are not allowed.";
        break;
      case "zip":
        if (!isValidZip(value)) return "Invalid ZIP code.";
        break;
      default:
        return "";
    }
    return "";
  }

  function validatePaymentField(key, value) {
    switch (key) {
      case "cardNumber":
        if (!isValidCardNumber(value)) return "Invalid card number.";
        break;
      case "cardName":
        if (hasNumbers(value)) return "Invalid name on card.";
        break;
      case "expDate":
        if (!isValidDate(value)) return "Invalid expiration date.";
        break;
      case "cvv":
        if (!isValidCVV(value)) return "Invalid CVV.";
        break;
      default:
        return "";
    }
    return "";
  }

  function nextStep() {
    if (validateBillingInfo()) setStep(2);
  }

  function prevStep() {
    setStep(1);
  }

  function handlePaymentChange(key, value) {
    if (key === "expDate") {
      value = formatExpirationDate(value);
    }
    const newPaymentInfo = { ...paymentInfo, [key]: value };
    newPaymentInfo.errors[key] = validatePaymentField(key, value);
    setPaymentInfo(newPaymentInfo);
  }

  function formatExpirationDate(value) {
    if (value.length === 2 && paymentInfo.expDate.length === 1) {
      value += "/";
    }
    return value;
  }

  function isValidDate(date) {
    const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!regex.test(date)) {
      return false;
    }
    const [month, year] = date.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    // Check if year is current or future
    if (year < currentYear) return false;
    // If it's the current year, check the month
    if (year === currentYear && month < currentMonth) return false;

    return true;
  }

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBillingInfo();
      case 2:
        return renderPaymentInfo();
      default:
        return null;
    }
  };

  function renderBillingInfo() {
    return (
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
            <Grid item xs={12} container justifyContent="flex-end">
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
  }

  function renderPaymentInfo() {
    return (
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
                <Typography>Loading...</Typography>
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
  }

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
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Error placing order:", error);
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <StyledCard>{renderStep()}</StyledCard>
    </Container>
  );
}

export default PaymentForm;
