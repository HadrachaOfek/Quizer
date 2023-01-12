import { Grid, Paper, Snackbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SnackbarContext } from "../App";
import lll from "../assets/mainLogo.png";
import ServerAddress from "../assets/ServerAddress";
import MultipalChoise from "./MultipalChoise";
import SingleChoise from "./SingleChoise";

function ExamPage() {
  const { openBackdrop, closeBackdrop } = useContext(SnackbarContext);
  const { userId, testId, testName } = useParams();
  const [testData, setTestData] = useState();
  const radius = "50px";

  useEffect(() => {
    const loadData = async () => {
      openBackdrop();
      const res = await axios.patch(
        ServerAddress(`users_test/start_test/${testId}/${userId}`)
      );
      if (res.data[0]) {
        setTestData(res.data[1]);
        console.log(res.data[1]);
        closeBackdrop();
      } else {
        window.location.replace("/exam_test_close_screen");
      }
    };
    loadData();
  }, []);
  return (
    <React.Fragment>
      <Paper
        sx={{
          position: "fixed",
          display: "flex",
          justifyContent: "space-between",
          width: "70vw",
          margin: "0px auto",
          left: "15vw",
          top: "0px",
          padding: "5px " + radius,
          height: "100px",
          borderRadius: `0px 0px ${radius} ${radius}`,
        }}
      >
        <img src={lll} height="64" />
        <Typography variant="h2">{testName}</Typography>
        {testData ? (
          <Clock endDate={Date.parse(testData.endTime)} />
        ) : (
          "00:00:00"
        )}
      </Paper>
      {testData ? (
        <Paper
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "70vw",
            margin: "125px auto 0px",
            padding: radius + " 20px",
            borderRadius: radius,
          }}
        >
          {testData.questions.map()}
          <MultipalChoise
            answers={[0, 1, 2, 3, 4]}
            question={"אני אשאל שאלה"}
          />
          <SingleChoise />
        </Paper>
      ) : undefined}
    </React.Fragment>
  );
}

export default ExamPage;

const Clock = ({ endDate }) => {
  const [newDatem, setNewDate] = useState(Date.now());
  useEffect(() => {
    if (endDate - newDatem >= 0) {
      setTimeout(() => setNewDate(Date.now()), 1000);
    } else {
      alert("test end");
    }
  }, [newDatem]);
  const hh = Math.floor((endDate - newDatem) / (1000 * 60 * 60));
  const mm = Math.floor(((endDate - newDatem) / (1000 * 60)) % 60);
  const ss = Math.floor(((endDate - newDatem) / 1000) % 60);
  return (
    <Typography variant="h3">
      {endDate - newDatem >= 0
        ? hh +
          ":" +
          (mm < 10 ? "0" + mm : mm) +
          ":" +
          (ss < 10 ? "0" + ss : ss)
        : "00:00:00"}
    </Typography>
  );
};
