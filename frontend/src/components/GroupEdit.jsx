import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { read, utils } from "xlsx";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import { SnackbarContext } from "../App";

function GroupEdit({
  groupName,
  testId,
  userId,
  password,
  close,
  deleteGroup,
}) {
  const [examineeId, setExamineeId] = useState("");
  const [examineeFirstName, setExamineeFirstName] = useState("");
  const [examineeLastName, setExamineeLastName] = useState("");
  const [examineesMap, setExamineesMap] = useState(new Map());
  const [uploadButton, setUploadButton] = useState("העלאת קובץ");
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const CreateExaminee = () => {
    CreateExamineeHelper(examineeId, examineeFirstName, examineeLastName);
    setExamineeId("");
    setExamineeFirstName("");
    setExamineeLastName("");
  };

  const CreateExamineeHelper = async (id, firstName, lastName) => {
    if (
      id.match("\\d{7,9}") &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      !examineesMap.has(id)
    ) {
      const res = await axios.post(
        ServerAddress(
          `users_test/build_pesonal_quiz/${userId}/${password}/${testId}`
        ),
        {
          userId: id,
          firstName: firstName,
          lastName: lastName,
          group: groupName,
        }
      );
      if (res.data[0]) {
        examineesMap.set(id, {
          userId: id,
          firstName: firstName,
          lastName: lastName,
        });
        setRefresh(!refresh);
      }
    }
  };

  useEffect(() => {
    fatchData();
  }, []);

  /**
   * Fatch the group data from the server
   */
  const fatchData = async () => {
    const res = await axios.get(
      ServerAddress(
        `users_test/get_all_examinees/${userId}/${password}/${testId}/${groupName}`
      )
    );
    const map = new Map();
    if (res.data[0]) {
      res.data[1].forEach((element) => {
        map.set(element.userId, {
          userId: element.userId,
          firstName: element.firstName,
          lastName: element.lastName,
        });
      });
    }
    setExamineesMap(map);
    setLoad(false);
  };

  const deleteExaminee = async (id) => {
    const res = await axios.patch(
      ServerAddress(
        `users_test/delete_examinee/${userId}/${password}/${testId}/${id}`
      )
    );
    const map = new Map();
    if (res.data[0]) {
      res.data[1].forEach((element) => {
        map.set(element.userId, {
          userId: element.userId,
          firstName: element.firstName,
          lastName: element.lastName,
        });
      });
    }
    setExamineesMap(map);
  };

  //handle excel upload
  const filePicker = document.createElement("input");
  filePicker.type = "file";
  filePicker.onchange = (e) => {
    setUploadButton(<LinearProgress />);
    fileReader.readAsBinaryString(e.target.files[0]);
  };

  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const word = read(fileReader.result, { type: "binary" });
    utils.sheet_to_json(word.Sheets[word.SheetNames[0]]).forEach((row) => {
      CreateExamineeHelper(row.id.toString(), row.firstName, row.lastName);
    });
    setUploadButton("העלאת קובץ");
  };
  return (
    <Container
      component={Paper}
      sx={{
        margin: "5vh auto",
        position: "relative",
        height: "90vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h2" align="center">
            {groupName}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack spacing={2}>
            <TextField
              value={examineeId}
              label="מספר מזהה"
              onChange={(e) => setExamineeId(e.target.value)}
            />
            <TextField
              label="שם פרטי"
              value={examineeFirstName}
              onChange={(e) => setExamineeFirstName(e.target.value)}
            />
            <TextField
              label="שם משפחה"
              value={examineeLastName}
              onChange={(e) => setExamineeLastName(e.target.value)}
            />
            <Button variant="contained" onClick={(e) => CreateExaminee()}>
              הוסף לרשימה
            </Button>
            <Divider />
            <Button variant="outlined" onClick={(e) => filePicker.click()}>
              {uploadButton}
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          {load ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height="20px" />
            </Stack>
          ) : (
            <Stack spacing={2}>
              {[...examineesMap.values()].map((element) => (
                <Paper
                  variant="outlined"
                  sx={{
                    padding: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  key={element.userId}
                >
                  <Typography variant="h5">
                    {element.firstName + " " + element.lastName}
                  </Typography>
                  <Box>
                    <Tooltip title="צפייה במבחן">
                      <IconButton>
                        <DescriptionIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחיקת מבחן של משתמש">
                      <IconButton
                        onClick={(e) => deleteExaminee(element.userId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
      <Box
        sx={{
          position: "absolute",
          bottom: "0px",
          left: "0px",
          right: "0px",
          padding: "10px",
        }}
      >
        <Divider sx={{ marginBottom: "10px" }} />
        <Stack direction="row" justifyContent="space-between">
          <Button variant="contained" onClick={(e) => close()}>
            סגור
          </Button>
          <Button variant="outlined" onClick={(e) => deleteGroup(groupName)}>
            מחק קבוצה
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default GroupEdit;
