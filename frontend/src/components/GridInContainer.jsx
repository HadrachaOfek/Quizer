import { Box } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";

function GridInContainer({ children, sx, inRow = 5 }) {
  return (
    <Container sx={{ ...sx, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          width: "fit-content",
          display: "grid",
          gridTemplateColumns: "repeat(" + inRow + ",1fr)",
          gap: "3vh",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default GridInContainer;
