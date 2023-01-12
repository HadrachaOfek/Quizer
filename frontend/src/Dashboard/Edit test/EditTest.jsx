import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../../assets/ServerAddress";
import { Grid, Button, Icon, Tooltip } from "@mui/material";
import "./Questions.css";
import Skeleton from "@mui/material/Skeleton";
import AddQuestion from "./AddQuestion";
import Question from "./Question";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </React.Fragment>
      );
    } else if (questions) {
      return (
        <React.Fragment>
          <h4 className="menu-header">השאלות שלי</h4>
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
                      onClick={() => deleteModal()}
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

  function deleteModal() {}

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid sm={3} item className="questions-menu">
          {questionStatus()}
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
    </React.Fragment>
  );
}

export default EditTest;