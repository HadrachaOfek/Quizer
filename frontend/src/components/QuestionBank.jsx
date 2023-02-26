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
  Tooltip,
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

function QuestionBank({
  isTestValid,
  deleteQuestion,
  testId,
  nextPage,
  data,
  numberOfQuestionsRequired,
  submitQuestion,
}) {
  const { userId, password } = useParams();
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
            <Typography variant="h1">{data.length}</Typography>
            <Typography variant="body" align="center">
              מספר שאלות
            </Typography>
          </Box>
          <Box>
            <Typography variant="h1">{numberOfQuestionsRequired}</Typography>
            <Typography variant="body" align="center">
              מספר שאלות דרוש
            </Typography>
          </Box>
          <Box>
            <Typography variant="h1">
              {data.filter((e) => e.active).length}
            </Typography>
            <Typography variant="body" align="center">
              מספר שאלות פעילות
            </Typography>
          </Box>
        </Stack>
        <Stack>
          <Typography variant="h3">
            תפריט שאלות
            <Divider />
          </Typography>
          {data.map((e) => (
            <Button
              onClick={(_) =>
                document
                  .getElementById(e._id)
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              <Typography variant="body1" width="100%" align="right">
                {e.question}
              </Typography>
            </Button>
          ))}
          <Button
            variant="outlined"
            onClick={(_) =>
              document
                .getElementById("new-question-card")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <Typography variant="body1" width="100%" align="right">
              {"שאלה חדשה"}
            </Typography>
          </Button>
        </Stack>
        <Stack
          height={"70vh"}
          id="full-questions-list"
          width={"60%"}
          alignItems="center"
          gap={2}
          sx={{ overflowY: "scroll" }}
          padding="0px 0px 0px 20px"
        >
          {data.map((element) => (
            <QuestionEdit
              deleteQuestion={deleteQuestion}
              submitQuestion={submitQuestion}
              data={element}
              key={element._id}
              testId={testId}
            />
          ))}
          <QuestionEdit
            submitQuestion={submitQuestion}
            deleteQuestion={deleteQuestion}
            testId={testId}
          />
        </Stack>
      </Stack>
      <Tooltip
        title={
          isTestValid
            ? "המשך להרשאות"
            : "יש לשים לב שמספר השאלות תואם למספר שהוגדר"
        }
      >
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
          {isTestValid ? "המשך" : "סיים"}
        </Button>
      </Tooltip>
    </React.Fragment>
  );
}

export default QuestionBank;
