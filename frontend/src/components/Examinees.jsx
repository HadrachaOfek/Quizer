import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext } from "react";
import { SnackbarContext } from "../App";
import CreateNewGroup from "./CreateNewGroup";

function Examinees({ testId, nextPage, groups, addGroup }) {
  const { popModal, closeModal } = useContext(SnackbarContext);

  const newGroup = (name) => {
    addGroup(name);
    closeModal();
  };
  return (
    <div>
      <Stack direction="row" order="5" justifyContent="space-evenly">
        {groups.map((group, index) => (
          <Button variant="outlined" key={index}>
            {group}
          </Button>
        ))}
      </Stack>
      <Button
        onClick={(e) => popModal(<CreateNewGroup newGroup={newGroup} />)}
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
