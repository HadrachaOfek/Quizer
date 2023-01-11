import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../../assets/ServerAddress";
import { Typography, Grid, TextField, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

export default function AddQuestion(props) {
  const { id, testid, password } = useParams();
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [img, setImg] = useState("");
  const [question, setQuestion] = useState("");
  const [totalGrade, setTotalGrade] = useState("");
  const [answers, setAnswers] = useState(new Array(10));
  const [currAnswers, setCurrAnswers] = useState([]);

  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.accept = "image/*";
  filePicker.onchange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImg("");
    }
  };

  const reader = new FileReader();
  reader.addEventListener("loadend", () => {
    setImg(reader.result);
  });

  const addQuestion = async () => {
    const res = await axios.post(
      ServerAddress(`question/create/${id}/${password}/${testid}`),
      {
        linkedTest: testid,
        type: type,
        img: img,
        active: active,
        question: question.trim(),
        totalGrade: totalGrade,
        answers: answers,
      }
    );
    console.log(res.data);
    if (res.data) {
      alert("השאלה נוספה בהצלחה !");
      setTimeout((_) =>
        window.location.replace(
          `/dashboard/edit_questions/${id}/${password}/${testid}`
        )
      );
    } else {
      alert("נראה שהייתה בעיה בהוספה, אנא נסה שנית");
    }
  };

  const addInput = () => {
    setCurrAnswers((s) => {
      return [
        ...s,
        {
          answer: "",
          grade: 0,
        },
      ];
    });
  };

  useEffect(() => {
    initValues();
    console.log(props);
  }, [props.initQuestion]);

  function initValues() {
    let initQuestion = props.initQuestion;
    if (initQuestion !== null) {
      setActive(initQuestion.active);
      setAnswers(initQuestion.answer);
      setImg(initQuestion.img);
      setQuestion(initQuestion.question);
      setTotalGrade(initQuestion.totalGrade);
      setType(initQuestion.type);
    } else {
      setActive("");
      setAnswers("");
      setImg("");
      setQuestion("");
      setTotalGrade("");
      setType("");
    }
  }

  const addAnswer = async (value, index, type) => {
    let obj;
    if (type === "grade") {
      obj = { grade: value };
    } else {
      obj = { answer: value };
    }
    answers[index] = { ...answers[index], ...obj };
    setAnswers(answers);
  };

  function editQuestion() {}

  return (
    <div>
      <Typography variant="h4" sx={{ margin: "10px" }}>
        הגדרות שאלה חדשה
      </Typography>
      <Grid container spacing={1}>
        <Grid item sx={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">סטטוס שאלה</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="סטטוס שאלה"
              defaultValue={active}
              onChange={(e) => {
                setActive(e.target.value);
              }}
            >
              <MenuItem value={true}>שאלה פעילה</MenuItem>
              <MenuItem value={false}>שאלה לא פעילה</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sx={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">סוג שאלה</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              label="סוג שאלה"
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <MenuItem value={0}>רב ברירה</MenuItem>
              <MenuItem value={1}>חד ברירה</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item sx={12} sm={5.6}>
          <TextField
            type="text"
            label="שאלה"
            defaultValue={props.initQuestion ? question : ""}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item sx={12} sm={5.7}>
          <TextField
            type="number"
            label="ציון כולל לשאלה"
            fullWidth
            onChange={(e) => setTotalGrade(e.target.value)}
          />
        </Grid>

        {currAnswers.map((item, i) => {
          return (
            <React.Fragment key={i}>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  label="יש להכניס תשובה"
                  fullWidth
                  onChange={(e) => addAnswer(e.target.value, i, "answer")}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="ציון"
                  fullWidth
                  onChange={(e) => addAnswer(e.target.value, i, "grade")}
                ></TextField>
              </Grid>
            </React.Fragment>
          );
        })}
        <Grid item sx={12}>
          <button className="add-answer" onClick={() => addInput()}>
            הוסף תשובה
          </button>
        </Grid>
        <Grid item sx={10} sm={3}>
          <Button
            fullWidth
            size="large"
            sx={{ height: "100%" }}
            variant="outlined"
            onClick={(e) => filePicker.click()}
          >
            {img ? <img src={img} width="100" height="100" /> : "הוספת תמונה"}
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          {props.initQuestion ? (
            <Button variant="contained" onClick={(e) => editQuestion()}>
              שמירת שינויים
            </Button>
          ) : (
            <Button variant="contained" onClick={(e) => addQuestion()}>
              הוסף שאלה
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
