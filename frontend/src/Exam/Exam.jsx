import { Backdrop, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import ExamPage from "./ExamPage";

export default function Exam() {
  const { userId, testId } = useParams();
  const [testData, setTestData] = useState([0]);

  const toShow = () => {
    if (testData === "LOADING")
      return (<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>)
    else if (testData.length > 0)
      return ExamPage();
    return TestCloseScreen();
  }
  return <React.Fragment>{toShow()}</React.Fragment>;
}

const TestCloseScreen = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
      <Paper sx={{width : '400px',height: '400px',display:'flex',flexDirection : 'column',alignItems : 'center',justifyContent : 'center'}}>
        <Typography variant='h2'>
          מבחן סגור
        </Typography>
        <Button color='primary' onClick={e=> window.location.replace('/')}>
          חזרה לעמוד הכניסה
        </Button>
      </Paper>
    </Box>
  );
}
