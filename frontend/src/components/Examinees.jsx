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
import GridInContainer from "./GridInContainer";
import GroupEdit from "./GroupEdit";

function Examinees({
  testId,
  nextPage,
  groups,
  addGroup,
  deleteGroup,
  groupsCount,
}) {
  const { password, userId } = useParams();
  const { popModal, closeModal } = useContext(SnackbarContext);

  const newGroup = (name) => {
    addGroup(name);
    closeModal();
  };
  return (
    <div>
      <GridInContainer inRow={Math.min(groups.length, 5)}>
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
                <Typography variant="body">
                  סה"כ {groupsCount[index]} רשומים בקורס
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </GridInContainer>
      <Button
        onClick={(e) =>
          popModal(<CreateNewGroup testId={testId} newGroup={newGroup} />)
        }
        sx={{ margin: " 5vh auto", display: "block" }}
        variant="outlined"
      >
        יצירת קבוצה חדשה
      </Button>
      <Stack
        gap={2}
        direction="row"
        sx={{
          position: "fixed",
          left: "50%",
          bottom: "3%",
          transform: "translateX(-50%)",
        }}
      >
        {/* {<Button
          onClick={(e) => {
            previousPage();
          }}
          variant="outlined"
        >
          חזור
        </Button>} */}
        <Button
          onClick={(e) => {
            nextPage();
          }}
          variant="contained"
        >
          סיים
        </Button>
      </Stack>
    </div>
  );
}

export default Examinees;
