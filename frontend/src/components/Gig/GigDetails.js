import React from "react";
import { makeStyles } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
}));

const GigDetailsPage = ({ gig }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <img src={gig.photo} alt={gig.title} className={classes.image} />
        </Grid>
        <Grid item xs={12} sm={6} container direction="column" justify="center">
          <Typography variant="h4" gutterBottom>
            {gig.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {gig.description}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default GigDetailsPage;
