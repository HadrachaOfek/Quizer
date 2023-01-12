import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { useContext } from "react";
import { SnackbarContext } from "../App";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

function EditQuestionsBank() {
  const { popAlert } = useContext(SnackbarContext);
  return (
    <Container>
      <Stack
        direction="row"
        width={"100%"}
        spacing={1}
        justifyContent="space-between"
      >
        <Box component={Paper} padding={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">בנק שאלות</Typography>
            <AccountBalanceIcon />
          </Stack>
        </Box>
        <Box component={Paper} padding={2}>
          <QuestionCard />
        </Box>
      </Stack>
    </Container>
  );
}

const QuestionCard = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={9}>
        <TextField label="שאלה" fullWidth />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField label="ציון" fullWidth />
      </Grid>
      <Grid item xs={12}>
        <TextField label="ציון" fullWidth />
      </Grid>
    </Grid>
  );
};
export default EditQuestionsBank;
