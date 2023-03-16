import { Paper } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

function PurpleBackground({ children }) {
  return (
    <Box id="purplebackground">
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: "auto",
          justifyContent: "center",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default PurpleBackground;
