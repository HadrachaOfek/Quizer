import {
  Autocomplete,
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

function QuestionEdit() {
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
  const [selectedType, setSelectedType] = useState([...typeMap.keys()][0]);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState("");
  const [file, setFile] = "";
  const [grade, setGrade] = useState();
  const [active, setActive] = useState(false);
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.accept = ".jpg, .jpeg, .png";
  filePicker.multiple = "false";
  filePicker.addEventListener("change", (e) => {
    console.log(e.target.size);
    fileReader.readAsDataURL(e.target.files[0]);
  });
  const fileReader = new FileReader();
  fileReader.addEventListener("load", (e) => console.log(fileReader.result));
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

  const deleteAnswers = (key) => {
    console.log(key);
    setAnswers(answers.filter((val) => val !== answers[key]));
    const temp = [];
    temp.forEach((element) => {
      if (element > key) {
        temp.push(element - 1);
      } else if (element < key) {
        temp.push(element);
      }
    });
    setCorrectAnswer(temp);
  };

  return (
    <Stack
      component={Paper}
      variant="outlined"
      sx={{
        width: "70%",
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
      {answers.map((value, key) => (
        <TextField
          key={key}
          defaultValue={value}
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
        <Tooltip title="מחק שאלה">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title="הפעל שאלה">
          <Switch checked={active} onClick={(e) => setActive(!active)} />
        </Tooltip>
        <TextField
          label="ציון"
          size="small"
          onChange={(e) => setGrade(e.target.value)}
          type="number"
        />
      </Stack>
    </Stack>
  );
}

export default QuestionEdit;
