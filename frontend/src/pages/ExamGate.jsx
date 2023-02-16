import { Button, Paper, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/QuizAirBlueLogo.png";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState } from "react";
import BlueBackground from "../components/BlueBackground";
import CenterWhiteWindow from "../components/CenterWhiteWindow";

function ExamGate() {
  const [examineeId, setExamineeId] = useState("");
  const [testPassword, setTestPassword] = useState("");
  return (
    <BlueBackground>
      <CenterWhiteWindow>
        <Stack justifyContent="center" alignItems="center">
          <img src={logo} width="40%" />
          <Stack width="40%" gap="10px">
            <Typography variant="caption">כניסה למבחן</Typography>
            <TextField
              label="מספר מזהה"
              error={(examineeId !== "") & !examineeId.match("\\d{7,9}")}
              helperText="מ.א לחיילים ת.ז לאזרחים"
              onChange={(e) => setExamineeId(e.target.value)}
            />
            <TextField
              label="קוד מבחן"
              helperText=" "
              error={
                (testPassword !== "") & !testPassword.match("[\\dA-Z]{8}")
              }
              onChange={(e) => setTestPassword(e.target.value)}
            />
            <Button variant="contained" size="large">
              התחבר
            </Button>
          </Stack>
          <Button
            color="inherit"
            sx={{ position: "absolute", bottom: "10px", left: "20px" }}
            onClick={(e) => (window.location.href = "/accounts/gate")}
          >
            <Stack alignItems="center">
              <ManageAccountsIcon fontSize="large" />
              <Typography variant="caption">כניסת מנהל</Typography>
            </Stack>
          </Button>
        </Stack>
      </CenterWhiteWindow>
    </BlueBackground>
  );
}

export default ExamGate;
