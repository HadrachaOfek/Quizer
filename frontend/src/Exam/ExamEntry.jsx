import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SnackbarContext } from "../App";
import ServerAddress from "../assets/ServerAddress";

function ExamEntry() {
  const [data, setData] = useState();
  const { userId, testId } = useParams();
  const { openBackdrop, closeBackdrop, popAlert } =
    useContext(SnackbarContext);
  useEffect(() => {
    openBackdrop();
    const loadData = async () => {
      const res = await axios.get(
        ServerAddress(`test/get_insturctions/${testId}`)
      );
      if (res.data[0]) {
        setData(res.data[1]);
        closeBackdrop();
      } else {
        window.location.href = "/";
      }
    };
    loadData();
  }, []);

  const handleSubmit = () => {
    window.location.href = `/exam/${userId}/${testId}/${data.title}`;
  };
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {data ? (
        <Stack component={Paper} gap="20px" padding={"20px"} maxWidth="1000px">
          <Typography variant="h1">ברוכים הבאים למבחן {data.title}</Typography>
          <Divider />
          <Typography variant="h3" align="center">
            הנחיות
          </Typography>
          <Typography variant="body" align="center">
            {data.insturctions}
          </Typography>
          <Divider />
          <Button variant="contained" onClick={(e) => handleSubmit()}>
            אישור וכניסה למבחן
          </Button>
        </Stack>
      ) : null}
    </Container>
  );
}

export default ExamEntry;
