import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SnackbarContext } from "../App";

function TestSummeryCard({ data, deleteTest }) {
  console.log(data);
  const { popModal } = useContext(SnackbarContext);
  const [openList, setOpenList] = useState(null);
  const { userId, password } = useParams();
  return (
    <Card sx={{ width: "200px" }} variant="outlined">
      <CardHeader
        sx={{
          gap: "6px",
          padding: "10px 5px",
        }}
        avatar={<ArticleIcon fontSize="large" color="primary" />}
        title={data !== null ? data.title : <Skeleton variant="text" />}
        action={
          <IconButton
            aria-label="settings"
            id="basic-button"
            aria-controls={openList ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openList ? "true" : undefined}
            onClick={(e) => setOpenList(e.target)}
          >
            <MoreVertIcon color="primary" />
          </IconButton>
        }
      ></CardHeader>
      <CardContent>
        <Menu
          id="basic-menu"
          anchorEl={openList}
          open={openList != null}
          onClose={(e) => setOpenList(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={(_) =>
              popModal(
                <DeleteTestAlert approveDelete={(e) => deleteTest(data._id)} />
              )
            }
          >
            <Typography variant="body1">מחיקה</Typography>
            <DeleteIcon htmlColor="#aaaaaa" />
          </MenuItem>
          <MenuItem
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={(_) =>
              (window.location.href = `/accounts/edit_test/${userId}/${password}?stg=0&id=${data._id}`)
            }
          >
            <Typography variant="body1">עריכה</Typography>
            <EditIcon htmlColor="#aaaaaa" />
          </MenuItem>
          <MenuItem
            sx={{ display: "flex", justifyContent: "space-between" }}
            onClick={(_) =>
              (window.location.href = `/accounts/edit_test/${userId}/${password}?stg=2&id=${data._id}`)
            }
          >
            <Typography variant="body1">נבחנים</Typography>
            <PeopleIcon htmlColor="#aaaaaa" />
          </MenuItem>
        </Menu>
        <Box
          sx={{ display: "grid", gridTemplateColumns: "80% 20%", gap: "3pt" }}
        >
          <Typography variant="body1">
            {data !== null ? "ממוצע ציונים" : <Skeleton variant="text" />}
          </Typography>
          <Typography variant="body1">
            {data !== null ? "ממוצע ציונים" : <Skeleton variant="text" />}
          </Typography>
          <Typography variant="body1">
            {data !== null ? "כמות הגשות" : <Skeleton variant="text" />}
          </Typography>
          <Typography variant="body1">
            {data !== null ? "ממוצע ציונים" : <Skeleton variant="text" />}
          </Typography>
          <Typography variant="body1">
            {data !== null ? "מבחנים פעילים" : <Skeleton variant="text" />}
          </Typography>
          <Typography variant="body1">
            {data !== null ? "ממוצע ציונים" : <Skeleton variant="text" />}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption">מבחן לא פעיל</Typography>
        <Tooltip title="הפעלת המבחן">
          <Switch checked={data.active} />
        </Tooltip>
      </CardActions>
    </Card>
  );
}

const DeleteTestAlert = ({ approveDelete }) => {
  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        padding: "20px",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h3">
          על מנת למחוק את המבחן, נא להקיש אישור
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={(e) => approveDelete()}
        >
          מחק את המבחן
        </Button>
      </Stack>
    </Paper>
  );
};

export default TestSummeryCard;
