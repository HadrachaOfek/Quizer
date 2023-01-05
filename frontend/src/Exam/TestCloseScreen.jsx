import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const TestCloseScreen = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
        <Paper sx={{width : '400px',height: '400px',display:'flex',flexDirection : 'column',alignItems : 'center',justifyContent : 'center'}}>
          <Typography variant='h2'>
            מבחן סגור
          </Typography>
          <Button color='primary' onClick={e=> window.location.replace('/')}>
            חזרה לעמוד הכניסה
          </Button>
            </Paper>
      </Box>
    );
  }

export default TestCloseScreen;
