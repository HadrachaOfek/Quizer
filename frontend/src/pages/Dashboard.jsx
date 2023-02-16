import { Button, Fab, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/QuizAirPurpleLogo.png";
import DefaultBackground from "../components/DefaultBackground";
import GridInContainer from "../components/GridInContainer";
import TestSummeryCard from "../components/TestSummeryCard";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useParams, useSearchParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";
import axios from "axios";
import { SnackbarContext } from "../App";

function Dashboard() {
  const { password, userId } = useParams();
  const [helloMsg, setHelloMsg] = useState("ברוכים הבאים");
  const [testList, setTestList] = useState([]);
  const { closeModal } = useContext(SnackbarContext);

  useEffect(() => {
    const getHelloMsg = async () => {
      const res = await axios.get(
        ServerAddress(`user/get_hello/${userId}/${password}`)
      );
      if (res.data[0]) {
        setHelloMsg(
          "שלום " + res.data[1].firstName + " " + res.data[1].lastName
        );
      }
    };

    const getData = async () => {
      const res = await axios.get(
        ServerAddress(`test/get_all/${userId}/${password}`)
      );
      if (res.data[0]) {
        setTestList(res.data[1]);
      }
    };

    getData();
    getHelloMsg();
  }, []);

  const deleteTest = async (id) => {
    closeModal();
    console.log(id);
    const res = await axios.delete(
      ServerAddress(`test/delete_test/${userId}/${password}/${id}`)
    );
    if (res.data[0]) {
      setTestList(testList.filter((test) => test._id !== id));
    }
    console.log(res.data);
  };
  return (
    <DefaultBackground>
      <Stack
        position="fixed"
        width="100vw"
        boxSizing="border-box"
        padding="20px"
      >
        <Stack direction="row" justifyContent="space-between">
          <img src={logo} alt="Quiz Air" width="10%" />
          <Fab color="primary" variant="extended">
            {helloMsg}
          </Fab>
        </Stack>
        <Typography variant="h1">מערכת ניהול מבחנים</Typography>
        <GridInContainer>
          {testList.map((test) => (
            <TestSummeryCard data={test} deleteTest={deleteTest} />
          ))}
        </GridInContainer>
      </Stack>
      <Button
        sx={{ position: "absolute", left: "2%", bottom: "2%" }}
        color="inherit"
        onClick={(_) =>
          (window.location.href = `/accounts/edit_test/${userId}/${password}`)
        }
      >
        <Stack alignItems="center">
          <NoteAddIcon />
          <Typography variant="caption">מבחן חדש</Typography>
        </Stack>
      </Button>
    </DefaultBackground>
  );
}

export default Dashboard;
