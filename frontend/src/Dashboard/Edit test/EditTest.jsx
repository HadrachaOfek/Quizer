import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../../assets/ServerAddress";
import {
  Grid,
  Button,
  Icon,
  Tooltip,
  Container,
  Stack,
  Paper,
  Divider,
  Typography,
} from "@mui/material";
import "./Questions.css";
import Skeleton from "@mui/material/Skeleton";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddQuestion from "./AddQuestion";
import Question from "./Question";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";

function EditTest() {
  const { id, testid, password } = useParams();
  const [questions, setQuestions] = useState("loading");
  const [addQuestionScreen, setAddQuestionScreen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState();
  const [currQuestionToShow, setCurrQuestionToShow] = useState();

  useEffect((_) => {
    getData();
  }, []);

  useEffect(
    (_) => {
      setQuestionToEdit(questionToEdit);
    },
    [questionToEdit]
  );

  const getData = async () => {
    const res = await axios.get(
      ServerAddress(`question/get_linkes_questions/${testid}`)
    );
    if (res.status === 200) {
      setQuestions(res.data);
    } else {
    }
  };

  function questionStatus() {
    if (questions === "loading") {
      return (
        <React.Fragment>
          {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((e, index) => {
            return (
              <Skeleton
                animation="wave"
                variant="rectangular"
                key={index}
                width={100}
                height={20}
              />
            );
          })}
        </React.Fragment>
      );
    } else if (questions) {
      return (
        <React.Fragment>
          {questions.map((question, index) => {
            return (
              <div className="question" key={index}>
                <p
                  onClick={() => {
                    setCurrQuestionToShow(question);
                    setAddQuestionScreen(false);
                    setQuestionToEdit(null);
                  }}
                >
                  {question.question}
                </p>
                <div className="question-icons">
                  <Tooltip title={"מחק שאלה"}>
                    <DeleteIcon
                      sx={{ paddingLeft: "3px", color: "white" }}
                      fontSize={"small"}
                      onClick={() => deleteQuestion(question)}
                    ></DeleteIcon>
                  </Tooltip>
                  <Tooltip title={"ערוך שאלה"}>
                    <EditIcon
                      style={{ color: "white" }}
                      fontSize={"small"}
                      onClick={() => setQuestionToEdit(question)}
                    ></EditIcon>
                  </Tooltip>
                </div>
              </div>
            );
          })}
          <Button
            className="button"
            onClick={() => {
              setAddQuestionScreen(true);
              setQuestionToEdit(null);
            }}
          >
            הוספת שאלה
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <div>!נראה שאין כאן שאלות... בואו נוסיף כאלה</div>
          <Button
            className="button"
            onClick={() => setAddQuestionScreen(true)}
          >
            הוספת שאלה
          </Button>
        </React.Fragment>
      );
    }
  }

  const deleteQuestion = async (question) => {
    const res = await axios.patch(
      ServerAddress(
        `question/delete/${id}/${password}/${testid}/${question._id}`
      )
    );
    if (res.data) {
      alert("השאלה נמחקה בהצלחה !");
      setTimeout((_) =>
        window.location.replace(
          `/dashboard/edit_questions/${id}/${password}/${testid}`
        )
      );
    }
  };

  return (
    <Container sx={{ height: "100vh", width: "100vw" }}>
      <Grid container spacing={1}>
        <Grid sm={3} item>
          <Stack
            divider={<Divider orientation="horizontal" />}
            component={Paper}
            padding={"10px"}
            height={"100vh"}
            spacing={1}
          >
            <Stack direction="row">
              <Typography variant="h4">בנק שאלות</Typography>
              <AccountBalanceIcon />
            </Stack>
            {questionStatus()}
          </Stack>
        </Grid>

        <Grid sm={9} className="screen" item>
          {addQuestionScreen || questionToEdit ? (
            <AddQuestion initQuestion={questionToEdit ?? null}></AddQuestion>
          ) : currQuestionToShow ? (
            <React.Fragment>
              <Question
                question={currQuestionToShow}
                id={id}
                testId={testid}
                password={password}
                editMode={false}
              ></Question>
            </React.Fragment>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default EditTest;
