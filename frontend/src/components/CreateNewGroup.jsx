import {
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/material";
import React, { useState } from "react";

function CreateNewGroup({ newGroup }) {
  const [input, setInput] = useState("");
  return (
    <Paper
      sx={{
        position: "absolute",
        transform: "translate(-50%,-50%)",
        top: "50%",
        left: "50%",
        padding: "25px",
      }}
      variant="outlined"
    >
      <Stack direction="column">
        <Typography variant="h3" align="center">
          שם קבוצה
        </Typography>
        <TextField
          margin="normal"
          placeholder="נא להזין שם לקבוצה"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          onClick={(e) =>
            input.trim() !== null ? newGroup(input.trim()) : undefined
          }
        >
          צור
        </Button>
      </Stack>
    </Paper>
  );
}

export default CreateNewGroup;
