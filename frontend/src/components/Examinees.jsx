import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { SnackbarContext } from "../App";
import CreateNewGroup from "./CreateNewGroup";
import GroupEdit from "./GroupEdit";

function Examinees({
  testId,
  nextPage,
  groups,
  addGroup,
  deleteGroup,
  isTestValid,
}) {
  const { password, userId } = useParams();
  const { popModal, closeModal } = useContext(SnackbarContext);

  const newGroup = (name) => {
    addGroup(name);
    closeModal();
  };
  return (
    <div>
      <Stack direction="row" order="5" justifyContent="space-evenly">
        {groups.map((group, index) => (
          <Card variant="outlined">
            <CardActionArea
              onClick={(e) =>
                popModal(
                  <GroupEdit
                    close={closeModal}
                    userId={userId}
                    password={password}
                    testId={testId}
                    groupName={group}
                    deleteGroup={deleteGroup}
                  />
                )
              }
            >
              <CardContent>
                <Typography variant="h3" align="center">
                  {group}
                </Typography>
                <Typography variant="body">סה"כ ס רשומים בקורס</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
      <Button
        onClick={(e) =>
          popModal(<CreateNewGroup testId={testId} newGroup={newGroup} />)
        }
        sx={{ margin: " 10px auto", display: "block" }}
        variant="contained"
      >
        יצירת קבוצה חדשה
      </Button>
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
        סיים
      </Button>
    </div>
  );
}

export default Examinees;
