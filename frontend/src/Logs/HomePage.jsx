import {
  Box,
  Button,
  Fab,
  Paper,
  SnackbarContent,
  TextField,
  Typography,
} from "@mui/material";
import { SnackbarContext } from "../App";
import React, { useContext } from "react";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";

function HomePage() {
  const { popAlert } = useContext(SnackbarContext);
  const [passcode, setPasscode] = useState("");
  const [userId, setUserId] = useState("");

  const enterTest = async () => {
    const res = await axios.get(
      ServerAddress(`users_test/is_not_tested/${passcode}/${userId}`)
    );
    if (res.data[0]) {
      if (res.data[1]) {
        popAlert("success", "הנך מועבר למבחן");
        window.location.href = `/exam_entry/${userId}/${res.data[2]}`;
      } else {
        popAlert("info", "בחינה בוצעה");
      }
    } else popAlert("error", res.data[1]);
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        variant="elevation"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2vh",
          width: "20vw",
          minWidth: "300px",
          padding: "25px",
        }}
      >
        <Typography variant="h4">כניסה למבחן</Typography>
        <TextField
          variant="outlined"
          label="קוד כניסה"
          onChange={(e) => setPasscode(e.target.value)}
          helperText={
            passcode.match("[^(A-Z)]") ? "הקוד מכיל רק אותיות גדולות" : " "
          }
        />
        <TextField
          variant="outlined"
          type="number"
          label="מספר מזהה"
          onChange={(e) => setUserId(e.target.value)}
          helperText={
            !userId.match("\\d{7,9}") ? "מספר מזהה באורך 9 או 7 ספרות" : " "
          }
        />
        <Button variant="contained" onClick={(e) => enterTest()}>
          כניסה למבחן
        </Button>
      </Paper>
      <Fab
        onClick={(e) => {
          window.location.replace("/login");
        }}
        variant="extended"
        color="secondary"
        sx={{
          position: "absolute",
          right: "1rem",
          bottom: "1rem",
          gap: "3px",
        }}
      >
        <SettingsIcon />
        <Typography variant="h4">כניסה למשתמשים רשומים </Typography>
      </Fab>
    </Box>
  );
}

export default HomePage;
