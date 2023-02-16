import {
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  Chip,
  Divider,
  Collapse,
  Box,
  Button,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import React, { useContext, useEffect } from "react";
import DefaultBackground from "../components/DefaultBackground";
import logo from "../assets/QuizAirPurpleLogo.png";
import { Container } from "@mui/system";
import useQuery from "../assets/useQuery";
import { useState } from "react";
import QuestionEdit from "../components/QuestionEdit";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";
import imagePlaceholder from "../assets/imagePlaceholder.jpg";
import { SnackbarContext } from "../App";
import TestSettings from "../components/TestSettings";

function EditTest() {
  const [stage, setStage] = useState(useQuery().get("stg") | 0);
  const [testId, setTestId] = useState(useQuery().get("id") || null);

  return (
    <DefaultBackground>
      <Stack position="fixed" width="100vw" padding="20px">
        <img src={logo} alt="Quiz Air" width="10%" />
        <Typography variant="h1" sx={{ paddingBottom: "20px" }}>
          עריכת מבחן
        </Typography>
        <Stepper activeStep={stage} alternativeLabel sx={{ direction: "ltr" }}>
          <Step key={0}>
            <StepLabel>הגדרת מבחן</StepLabel>
          </Step>
          <Step key={1}>
            <StepLabel>בנק שאלות</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>הרשאות</StepLabel>
          </Step>
        </Stepper>
        <Container>
          <Collapse in={stage === 0}>
            <TestSettings testId={testId} nextPage={(e) => setStage(1)} />
          </Collapse>
          <Collapse in={stage === 1}>
            <QuestionBank testId={testId} nextPage={(e) => setStage(2)} />
          </Collapse>
          <Collapse in={stage === 2}>
            <Examinees testId={testId} nextPage={(e) => setStage(2)} />
          </Collapse>
        </Container>
      </Stack>
    </DefaultBackground>
  );
}

const QuestionBank = ({ nextPage }) => {
  return (
    <React.Fragment>
      <Stack
        component={Container}
        gap={2}
        margin={"10px auto"}
        direction="row"
        justifyContent="space-between"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack gap={10}>
          <Box>
            <Typography variant="h1">34</Typography>
            <Typography variant="body" align="center">
              מספר שאלות
            </Typography>
          </Box>
          <Box>
            <Typography variant="h1">34</Typography>
            <Typography variant="body" align="center">
              מספר שאלות
            </Typography>
          </Box>
          <Box>
            <Typography variant="h1">34</Typography>
            <Typography variant="body" align="center">
              מספר שאלות
            </Typography>
          </Box>
        </Stack>
        <Stack>
          <Typography variant="h3">
            תפריט שאלות
            <Divider />
          </Typography>
        </Stack>
        <QuestionEdit />
      </Stack>
      <Button
        sx={{
          position: "fixed",
          left: "50%",
          bottom: "3%",
          transform: "translateX(-50%)",
        }}
        onClick={(e) => {
          nextPage();
        }}
        variant="contained"
      >
        המשך
      </Button>
    </React.Fragment>
  );
};

const Examinees = () => {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            הגדירו למי יש גישה להשיב למבחן
          </Typography>
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="שם פרטי" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="שם משפחה" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <TextField label="מספר אישי" size="small" fullWidth />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <Button variant="contained" size="medium" fullWidth>
            <PersonAddIcon />
            <Typography variant="caption">הוספה</Typography>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditTest;
