import {
  Autocomplete,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../../assets/ServerAddress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import { SnackbarContext } from "../../App";

function EditUsers() {
  const { id, password, testId } = useParams();
  const [data, setData] = useState([]);
  const [possibleUsers, setPossibleUsers] = useState(new Map());

  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { popAlert } = useContext(SnackbarContext);

  const loadData = async () => {
    const res = await axios.get(
      ServerAddress(`users_test/get_all_examinees/${id}/${password}/${testId}`)
    );
    if (res.data[0]) {
      setData(res.data[1]);
    } else {
      popAlert("error", res.data[1]);
    }
  };

  const loadPossibleUsers = async () => {
    const res = await axios.get(
      ServerAddress(`users_test/get_all_possible_examinees/${id}/${password}`)
    );
    if (res.data[0]) {
      const dict = new Map();
      res.data[1].forEach((element) => {
        dict.set(element.userId, {
          firstName: element.firstName,
          lastName: element.lastName,
        });
      });
      setPossibleUsers(dict);
    } else {
      popAlert("error", res.data[1]);
    }
  };
  useEffect(() => {
    loadPossibleUsers();
    loadData();
  }, []);

  const writeUser = async () => {
    const res = await axios.patch(
      ServerAddress(
        `users_test/build_pesonal_quiz/${id}/${password}/${testId}`
      ),
      {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
      }
    );
    if (res.data[0]) {
      loadData();
      loadPossibleUsers();
    } else {
      popAlert("error", res.data[1]);
    }
    setFirstName("");
    setLastName("");
    setUserId("");
  };

  const userIdTypeing = (value) => {
    setUserId(value);
    if (possibleUsers.has(value)) {
      setFirstName(possibleUsers.get(value).firstName);
      setLastName(possibleUsers.get(value).lastName);
    }
  };
  return (
    <React.Fragment>
      <Container>
        <Stack
          direction="row"
          justifyContent="center"
          component={Paper}
          sx={{
            width: "100%",
            margin: "10px 0px",
            padding: "20px 10px",
            gap: "10px",
          }}
        >
          <Autocomplete
            freeSolo={true}
            disablePortal
            id="combo-box-demo"
            options={[...possibleUsers.keys()]}
            size="small"
            sx={{ minWidth: "200px" }}
            renderOption={(props, option) => {
              return (
                <Box component="li" sx={{ padding: "4px" }} {...props}>
                  {option} | {possibleUsers.get(option).firstName} &nbsp;
                  {possibleUsers.get(option).lastName}
                </Box>
              );
            }}
            onInputChange={(e, value) => userIdTypeing(value)}
            renderInput={(params) => (
              <TextField {...params} label="מספר מזהה" value={userId} />
            )}
          />
          <TextField
            label="שם פרטי"
            variant="outlined"
            value={firstName}
            size="small"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="שם משפחה"
            variant="outlined"
            value={lastName}
            size="small"
            onChange={(e) => setLastName(e.target.value)}
          />

          <Button
            variant="contained"
            size="medium"
            disabled={
              !(
                userId.match("\\d{7,9}") &&
                firstName.match(".+") &&
                lastName.match(".+")
              )
            }
            onClick={(e) => writeUser()}
          >
            הוסף
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableCell>מספר מזהה</TableCell>
              <TableCell>שם פרטי</TableCell>
              <TableCell>שם משפחה</TableCell>
              <TableCell>סטטוס מבחן</TableCell>
              <TableCell>פעולות</TableCell>
            </TableHead>
            <TableBody>
              {data.map((element, index) => {
                return <UsersRow key={index} {...element} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Fab
        onClick={(e) => {
          window.location.replace(
            `http://localhost:3000/dashboard/${id}/${password}`
          );
        }}
        variant="circular"
        size="small"
        sx={{ position: "fixed", right: "10px", bottom: "10px" }}
      >
        <ArrowForwardIosIcon />
      </Fab>
    </React.Fragment>
  );
}

export default EditUsers;

const UsersRow = ({ userId, firstName, lastName, _id, endTime }) => {
  return (
    <TableRow>
      <TableCell>{userId}</TableCell>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{endTime ? "בוצע" : "ממתין"}</TableCell>
      <TableCell>
        <Tooltip title="מחק">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
