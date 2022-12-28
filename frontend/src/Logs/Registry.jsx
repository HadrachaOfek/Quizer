import { Alert, Button, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { SHA256 } from "crypto-js";
import React from "react";
import { useState } from "react";
import { paperPageStyle } from "../App";
import ServerAddress from "../assets/ServerAddress";
import useQuery from "../assets/useQuery";

function Registry() {
    const [id,setId] = useState(useQuery().get('userid'));
    const [firstName,setFirstName] = useState(null);
    const [lastName,setLastName] = useState(null);
    const [password,setPassword] = useState(null);
    const [passwordError,setPasswordError] = useState(true);
    const [SnackbarOpen,setSnackbarOpen] = useState(false);
    const [snackbarSeverity,setSnackbarSeverity] = useState('succes');
    const [snackbarMessage,setSnackbarMessage] = useState("");

    const Register = async() =>
    {
        if(firstName === null || firstName.trim() === "" || lastName === null || lastName.trim() === "" || isNaN(id) || (id.length !== 9 & id.length !== 7))
        {
            setSnackbarMessage("יש טעות באחד או יותר מהפרטים שהוזנו");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        else{
            const res = await axios.get(ServerAddress(`user/exist/${id}`));
            if(res.data)
            {
                setSnackbarMessage('משתנה זה כבר קיים במערכת מועבר לדף כניסה');
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
            }
            else{
                const res = await axios.post(ServerAddress(`user/create`),{
                    firstName: firstName,
                    lastName: lastName,
                    password: SHA256(password).toString(),
                    userId: id,})
                if(res.status === 200)
                {
                    setSnackbarMessage('ההרשמה צלחה, הנכם מועברים ללוח ניהול');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                    window.location.replace(`/dashboard/${id}/${SHA256(password).toString()}`)
                }
                else{
                    setSnackbarMessage('נראה שיש לנו בעיה עם השרת, תחזרו עוד כמה דקות');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                }
            }
        }
    };

  return (<React.Fragment>
    <Snackbar open={SnackbarOpen} onClose={e=>setSnackbarOpen(false)} autoHideDuration={5000}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
    </Snackbar>
    <Box sx={{display : 'flex',height : '100vh',width : '100vw',justifyContent : 'center',alignItems:'center'}}>
    <Paper sx={paperPageStyle}>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant='h4'>
                    הרשמה למערכת
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField label='מספר מזהה' value={id} onChange={(e) => setId(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField label='שם פרטי' onChange={(e) => setFirstName(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField label='שם משפחה' onChange={(e) => setLastName(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField type='password' label='סיסמה' onChange={(e) => setPassword(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <TextField type='password' label='וידוא סיסמה' onChange={(e) => setPasswordError(e.target.value === password) } error={!passwordError} helperText={!passwordError ? 'הסיסמאות לא זהות' : undefined} fullWidth />
            </Grid>
            <Grid item xs={12}>
                <Button variant='contained' onClick={e => Register()} fullWidth>
                    הרשמה
                </Button>
            </Grid>
        </Grid>
    </Paper>
  </Box>
  </React.Fragment>);
}

export default Registry;
