import * as React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

// Styled component for the footer
const FooterContainer = styled("footer")(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  color: "#333",
  textAlign: "center",
  padding: theme.spacing(2.5),
  marginTop: "auto", // This pushes the footer to the bottom
}));

function Footer() {
  return (
    <FooterContainer>
      <Container maxWidth="sm">
        <Typography variant="body2" color="textSecondary">
          {"Copyright © "}
          ITFreelancers {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    </FooterContainer>
  );
}

export default Footer;
