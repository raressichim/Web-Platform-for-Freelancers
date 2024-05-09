import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import palmtreesPhoto from "../../assets/palmtreesPhoto.jpg";

const defaultTheme = createTheme();
const SERVER = "http://localhost:8080";

export default function LogInForm() {
  let navigate = useNavigate();
  const { login } = useUser();
  const [error, setError] = useState(null);
  const [emailForRecovery, setEmailForRecovery] = useState("");
  const [token, setToken] = useState("");
  const [receivedToken, setReceivedToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentDialog, setCurrentDialog] = useState(0); // Dialog state: 0 - closed, 1 - email, 2 - token, 3 - new password

  const handleSendToken = async () => {
    try {
      const response = await fetch(`${SERVER}/email/send`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForRecovery }),
      });
      if (response.ok) {
        const data = await response.json();
        setReceivedToken(data);
        alert(
          "Email sent successfully. Please check your inbox for the token."
        );
        setCurrentDialog(2);
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending email.");
    }
  };

  const handleTokenVerification = () => {
    if (token === receivedToken.toString()) {
      setCurrentDialog(3);
    } else {
      alert("Token is incorrect, please try again.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(`${SERVER}/user/changePassword`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForRecovery, newPassword }),
      });
      if (response.ok) {
        alert("Password changed successfully.");
        navigate("/");
      } else {
        alert("Failed to change password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while changing the password.");
    }
  };

  const handleCloseDialog = () => setCurrentDialog(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get("email");
    let password = data.get("password");
    let userData = { email, password };
    try {
      const response = await fetch(`${SERVER}/user/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const user = await response.json();
        login(user);
        navigate("/");
      } else {
        setError("Authentication failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${palmtreesPhoto})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
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
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ color: "black" }}
                    onClick={() => setCurrentDialog(1)}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <RouterLink to="/signup">
                    {"Don't have an account? Sign Up"}
                  </RouterLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Email Dialog */}
      <Dialog open={currentDialog === 1} onClose={() => setCurrentDialog(0)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your email address here. We
            will send you a token to proceed with password reset.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={emailForRecovery}
            onChange={(e) => setEmailForRecovery(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentDialog(0)}>Cancel</Button>
          <Button onClick={handleSendToken}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Token Dialog */}
      <Dialog open={currentDialog === 2} onClose={() => setCurrentDialog(0)}>
        <DialogTitle>Enter Token</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="token"
            label="Token"
            type="text"
            fullWidth
            variant="standard"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentDialog(0)}>Cancel</Button>
          <Button onClick={handleTokenVerification}>Verify Token</Button>
        </DialogActions>
      </Dialog>

      {/* New Password Dialog */}
      <Dialog open={currentDialog === 3} onClose={() => setCurrentDialog(0)}>
        <DialogTitle>Set New Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="New Password"
            type="password"
            fullWidth
            variant="standard"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentDialog(0)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
