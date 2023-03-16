import { Button, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SnackbarContext } from "../App";
import ServerAddress from "../assets/ServerAddress";
import BlueBackground from "../components/BlueBackground";
import CenterWhiteWindow from "../components/CenterWhiteWindow";
import DefaultBackground from "../components/DefaultBackground";

function InstructionsPage() {
  const { userId, testId } = useParams();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState();
  const { openBackdrop, closeBackdrop } = useContext(SnackbarContext);

  useEffect((_) => {
    openBackdrop();
    getInstructions();
  }, []);

  const getInstructions = async () => {
    const res = await axios.get(
      ServerAddress(`test/get_instructions/${testId}`)
    );
    if (res.data[0]) {
      setTitle(res.data[1].title);
      setInstructions(res.data[1].instructions);
      closeBackdrop();
    }
  };

  const handleStartQuizButton = () => {
    window.location.href = `/exam/exam_page/${userId}/${testId}`;
  };
  return (
    <BlueBackground>
      <CenterWhiteWindow>
        <Stack width={"70%"} margin="auto" spacing={1} alignItems="center">
          <Typography variant="h1">{title}</Typography>
          <Divider sx={{ width: "100%" }} />
          <Typography variant="body1" align="center">
            {instructions}
          </Typography>
          <Button variant="contained" onClick={(_) => handleStartQuizButton()}>
            המשך למבחן
          </Button>
        </Stack>
      </CenterWhiteWindow>
    </BlueBackground>
  );
}

export default InstructionsPage;
