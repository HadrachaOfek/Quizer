import art from "../assets/TestCloseArt.svg";
import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import { Fab, IconButton, Typography } from "@mui/material";

function TestClose() {
  return (
    <React.Fragment>
      <img
        src={art}
        style={{
          position: "absolute",
          transform: "translate(-35%,-50%)",
          top: "50%",
          left: "35%",
          width: "60%",
        }}
      />
      <Fab
        onClick={(e) => (window.location.href = "/")}
        variant="extended"
        sx={{
          position: "absolute",
          right: "3%",
          bottom: "3%",
          display: "flex",
          gap: "5px",
        }}
      >
        <HomeIcon fontSize="large" />
        <Typography variant="caption">חזרה לעמוד הבית</Typography>
      </Fab>
    </React.Fragment>
  );
}

export default TestClose;
