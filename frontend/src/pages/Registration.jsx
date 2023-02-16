import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import logo from "../assets/QuizAirPurpleLogo.png";
import CenterWhiteWindow from "../components/CenterWhiteWindow";
import PurpleBackground from "../components/PurpleBackground";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import { SHA256 } from "crypto-js";
import { useContext } from "react";
import { SnackbarContext } from "../App";
import { useEffect } from "react";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";

function Registration() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPassordVerification, setUserPassordVerification] = useState("");
  const { popAlert } = useContext(SnackbarContext);
  const [isValid, setIsValid] = useState(false);
  const handleSubmit = async () => {
    console.log({
      firstName: firstName,
      lastName: lastName,
      password: SHA256(userPassword).toString(),
      admin: false,
      userId: userId,
    });
    const res = await axios.post(ServerAddress(`user/create`), {
      firstName: firstName,
      lastName: lastName,
      password: SHA256(userPassword).toString(),
      userId: userId,
    });
    if (res.data[0]) {
      popAlert("success", "משתמש חדש נרשם, הנכם מועברים");
      window.location.href = `/dashboard/${SHA256(
        userPassword
      ).toString()}/${userId}`;
    } else {
      popAlert("error", res.data[1]);
    }
  };

  useEffect(() => {
    setIsValid(
      userId.match("\\d{7,9}") &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        userPassordVerification === userPassword
    );
  }, [firstName, lastName, userId, userPassword, userPassordVerification]);
  return (
    <PurpleBackground>
      <CenterWhiteWindow>
        <Stack justifyContent="center" alignItems="center">
          <img src={logo} width="40%" />
          <Stack width="40%" gap="1px">
            <Typography variant="h6">הרשמה</Typography>
            <TextField
              label="שם פרטי"
              helperText=" "
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="שם משפחה"
              helperText=" "
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="מספר מזהה"
              helperText="מ.א לחיילים ת.ז לאזרחים"
              onChange={(e) => setUserId(e.target.value)}
            />
            <TextField
              label="סיסמה"
              helperText=" "
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <TextField
              label="אישור סיסמה"
              helperText=" "
              onChange={(e) => setUserPassordVerification(e.target.value)}
            />

            <Button
              variant="contained"
              size="large"
              onClick={(e) => handleSubmit()}
              disabled={!isValid}
            >
              הרשמה
            </Button>
            <Typography variant="body1">
              כבר רשומים? <Link href="/accounts/gate">להתחברות</Link>
            </Typography>
          </Stack>
        </Stack>
      </CenterWhiteWindow>
    </PurpleBackground>
  );
}

export default Registration;
