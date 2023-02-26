import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  setRef,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import imagePlaceholder from "../assets/imagePlaceholder.jpg";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import GridInContainer from "./GridInContainer";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SegmentIcon from "@mui/icons-material/Segment";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import CheckBox from "@mui/icons-material/CheckBox";
import Delete from "@mui/icons-material/Delete";
import { SHA256 } from "crypto-js";

function QuestionEdit({ submitQuestion, data, testId, deleteQuestion }) {
  const [correctAnswer, setCorrectAnswer] = useState([]);
  const typeMap = new Map();
  typeMap.set("רב בחירה", {
    icon: <CheckBoxIcon color="primary" />,
    input: (key) => (
      <Checkbox
        onClick={(e) => chooseCorrectAnswer(key)}
        checked={correctAnswer.indexOf(key) !== -1}
      />
    ),
  });
  typeMap.set("חד בחירה", {
    icon: <RadioButtonCheckedIcon color="primary" />,
    input: (key) => (
      <Radio
        onClick={(e) => chooseCorrectAnswer(key)}
        checked={correctAnswer.indexOf(key) !== -1}
      />
    ),
  });
  typeMap.set("שאלה פתוחה", {
    icon: <SegmentIcon color="primary" />,
    input: (value) => undefined,
  });
  const [refresh, setRefresh] = useState(false);
  const [selectedType, setSelectedType] = useState(
    data ? data.type : [...typeMap.keys()][0]
  );
  const [answers, setAnswers] = useState(data ? data.answers : []);
  const [question, setQuestion] = useState(data ? data.question : "");
  const [file, setFile] = useState(data ? data.img : null);
  const [grade, setGrade] = useState(data ? data.totalGrade : 0);
  const [active, setActive] = useState(data ? data.active : false);
  const [isValid, setIsValid] = useState(false);
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.accept = ".jpg, .jpeg, .png";
  filePicker.multiple = "false";
  filePicker.addEventListener("change", (e) => {
    console.log(e.target.size);
    fileReader.readAsDataURL(e.target.files[0]);
  });
  const fileReader = new FileReader();
  fileReader.addEventListener("load", (e) => setFile(fileReader.result));
  useEffect((e) => setCorrectAnswer([]), [selectedType]);
  const chooseCorrectAnswer = (ans) => {
    console.log(ans);
    if (selectedType === "רב בחירה") {
      if (correctAnswer.indexOf(ans) != -1) {
        setCorrectAnswer(correctAnswer.filter((e) => e !== ans));
      } else {
        correctAnswer.push(ans);
        setRefresh(!refresh);
      }
    } else if (selectedType === "חד בחירה") {
      setCorrectAnswer([ans]);
    }
  };

  useEffect((e) => {
    if (data) {
      setCorrectAnswer(
        data.answers
          .map((element, index) =>
            data.correctAnswers.indexOf(SHA256(element).toString()) !== -1
              ? index
              : null
          )
          .filter((e) => e !== null)
      );
    }
  }, []);

  const deleteAnswers = (key) => {
    const temp = [];
    correctAnswer.forEach((element) => {
      console.log(element);
      if (element > key) {
        temp.push(element - 1);
      } else if (element < key) {
        temp.push(element);
      }
    });
    setAnswers(answers.filter((val) => val !== answers[key]));
    setCorrectAnswer(temp);
  };

  useEffect(
    (_) => {
      let temp =
        question.trim() !== "" &&
        correctAnswer.length !== 0 &&
        grade > 0 &&
        grade < 101;
      answers.forEach((e) => (temp = temp & (e.trim() !== "")));
      setIsValid(temp);
    },
    [refresh, question, selectedType, grade, correctAnswer]
  );

  const saveQuestion = () => {
    submitQuestion(data ? data._id : null, {
      linkedTest: testId,
      type: selectedType,
      img: file,
      active: active,
      question: question,
      totalGrade: grade,
      answers: answers,
      correctAnswers: correctAnswer.map((element) =>
        SHA256(answers[element]).toString()
      ),
    });
    if (!data) {
      setFile(null);
      setQuestion("");
      setAnswers([]);
      setCorrectAnswer([]);
      grade(0);
    }
  };

  return (
    <Stack
      id={data ? data._id : "new-question-card"}
      component={Paper}
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: "20px",
        padding: "20px",
        height: "fit-content",
        background: "rgba(0,0,0,0)",
      }}
      spacing={1}
    >
      <Stack direction="row">
        <TextField
          label="שאלה"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          fullWidth
          sx={{ width: "170%" }}
        />
        <Tooltip title="העלאת תמונה לשאלה">
          <IconButton onClick={(e) => filePicker.click()}>
            <FileUploadIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">
            סוג שאלה
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={selectedType}
            label="סוג שאלה"
            onChange={(e, value) => setSelectedType(e.target.value)}
          >
            {[...typeMap.keys()].map((option, key) => (
              <MenuItem value={option} key={key}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {file ? (
        <Tooltip title="הקשה כפולה להסרה">
          <Button onDoubleClick={(e) => setFile(null)}>
            <img
              src={file}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "contain",
              }}
            />
          </Button>
        </Tooltip>
      ) : undefined}
      {answers.map((value, key) => (
        <TextField
          key={key}
          value={value}
          placeholder="נא להזין תשובה"
          fullWidth
          onChange={(e) => {
            answers[key] = e.target.value;
            setRefresh(!refresh);
          }}
          InputProps={{
            startAdornment: typeMap.get(selectedType).input(key),
            endAdornment: (
              <Tooltip title="מחק שאלה">
                <IconButton onClick={(e) => deleteAnswers(key)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      ))}
      <Tooltip title="הוספת תשובה">
        <IconButton
          sx={{ width: "fit-content", alignSelf: "center" }}
          onClick={(e) => {
            if (answers.indexOf("") === -1) {
              answers.push("");
            }
            setRefresh(!refresh);
          }}
        >
          <AddCircleOutlineIcon color="primary" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Divider />
      <Stack direction="row" justifyContent="end" alignItems="center">
        <Tooltip title="שמור שאלה">
          <IconButton disabled={!isValid} onClick={(_) => saveQuestion()}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        {data ? (
          <Tooltip title="מחק שאלה">
            <IconButton onClick={(_) => deleteQuestion(data._id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        ) : undefined}
        <Tooltip title="הפעל שאלה">
          <Switch checked={active} onClick={(e) => setActive(!active)} />
        </Tooltip>
        <TextField
          value={grade}
          label="ציון"
          size="small"
          onChange={(e) => setGrade(e.target.valueAsNumber)}
          type="number"
        />
      </Stack>
    </Stack>
  );
}

export default QuestionEdit;
