import { Paper } from "@mui/material";
import React from "react";

function CenterWhiteWindow({ children }) {
  return (
    <Paper
      variant="elevation"
      sx={{
        height: "90%",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {children}
    </Paper>
  );
}

export default CenterWhiteWindow;
