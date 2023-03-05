import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  Icon,
  IconButton,
  Slide,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoneIcon from "@mui/icons-material/Done";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Container } from "@mui/system";
import React from "react";
import CountDownTimer from "../components/CountDownTimer";
import DefaultBackground from "../components/DefaultBackground";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import QuestionCard from "../components/QuestionCard";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";
import CheckBox from "@mui/icons-material/CheckBox";
import Delete from "@mui/icons-material/Delete";
import { useContext } from "react";
import { SnackbarContext } from "../App";
function ExamPage() {
  const [image, setImage] = useState();
  const { userId, testId } = useParams();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [markedQuestions, setMarkedQuestion] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState(new Map());
  const { openBackdrop, closeBackdrop } = useContext(SnackbarContext);
  const [isUpdate, setIsUpdate] = useState(true);
  const [endTime, setEndTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [ID, setID] = useState();
  const [isAllowToSubmit, setIsAllowToSubmit] = useState(false);
  useEffect((_) => {
    loadExamineeTest();
  }, []);

  const updateDataToServer = async () => {
    setIsUpdate(false);
    const answers = [];
    selectedAnswers.forEach((ans, que) =>
      answers.push({ linkedQuestion: que, answers: ans })
    );
    const res = await axios.patch(
      ServerAddress(`users_test/update_answear/${ID}`),
      {
        answers: answers,
      }
    );
    setIsUpdate(true);
    checkIfAllowToSubmit();
  };

  //check if the user complete all the questions
  const checkIfAllowToSubmit = () => {
    var temp = true;
    selectedAnswers.forEach((val, key) => {
      temp = temp && val.length !== 0;
    });
    setIsAllowToSubmit(temp);
  };

  //get_personal_test/:userId/:testId
  const loadExamineeTest = async () => {
    openBackdrop("blue");
    const res = await axios.get(
      ServerAddress(`users_test/get_personal_test/${userId}/${testId}`)
    );
    if (res.data[0]) {
      setImage(res.data[2].logo);
      setQuestions(res.data[3]);
      setTitle(res.data[2].title);
      setID(res.data[1]._id);
      setDuration(res.data[2].duration);
      setEndTime(res.data[1].endTime);
      const temp = new Map();
      res.data[1].questions.forEach((e) => {
        temp.set(e.linkedQuestion, e.answers);
      });
      setSelectedAnswers(temp);
      checkIfAllowToSubmit();
      closeBackdrop();
    }
  };

  const handleSubmit = async () => {
    const res = await axios.patch(ServerAddress(`users_test/end_test/${ID}`));
    console.log(res.data);
    if (res.data[0]) {
      window.location.href = "/";
    }
  };

  const handleMarkQuestion = (id) => {
    setMarkedQuestion(markedQuestions.concat([id]));
  };
  const handleDeMarkQuestion = (id) => {
    setMarkedQuestion(markedQuestions.filter((e) => e !== id));
  };
  return (
    <DefaultBackground>
      <Stack sx={{ width: "10vw", position: "fixed" }}>
        <CountDownTimer
          onEnd={(_) => handleSubmit()}
          run={true}
          duration={duration}
          endTime={new Date(endTime).getTime()}
        />
        <Button>
          {isUpdate ? (
            <Typography>מבחן נשמר</Typography>
          ) : (
            <Typography>
              {" "}
              שומר נתונים <CircularProgress size="12pt" />
            </Typography>
          )}
        </Button>
        {questions.map((element, index) => (
          <Button
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr 1fr",
            }}
            fullWidth
            onClick={(_) => {
              document.getElementById(`${element._id}`).scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            <Typography variant="caption" align="right">
              {element.question}
            </Typography>
            <Checkbox
              checked={markedQuestions.indexOf(element._id) !== -1}
              icon={<BookmarkBorderIcon />}
              checkedIcon={<BookmarkIcon />}
            />
            {selectedAnswers.get(element._id).length !== 0 && <DoneIcon />}
          </Button>
        ))}
      </Stack>
      <Stack
        component={Container}
        spacing={2}
        sx={{
          width: "70vw",
          position: "relative",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h1">{title}</Typography>
        {questions.map((e) => {
          return (
            <QuestionCard
              key={e._id}
              id={e._id}
              question={e.question}
              img={e.img}
              answers={e.answers}
              selected={selectedAnswers.get(e._id)}
              type={e.type}
              onMark={(id) => handleMarkQuestion(id)}
              onDemark={(id) => handleDeMarkQuestion(id)}
              onSelect={(ans) => {
                selectedAnswers.set(e._id, ans);
                updateDataToServer();
              }}
            />
          );
        })}
      </Stack>
      <img
        src={image}
        style={{
          width: "128px",
          height: "128px",
          position: "fixed",
          top: "10px",
          left: "20px",
          clipPath: "circle(50%)",
          margin: "10px auto",
          display: "block",
        }}
      />
      <Slide in={isAllowToSubmit} direction="up">
        <Fab
          variant="extended"
          color="primary"
          onClick={(_) => isAllowToSubmit && handleSubmit()}
          sx={{
            zIndex: "1",
            position: "fixed",
            bottom: "20px",
            right: "50%",
            transform: "translateX(-50%)",
          }}
        >
          הגש מבחן
        </Fab>
      </Slide>
    </DefaultBackground>
  );
}

export default ExamPage;
