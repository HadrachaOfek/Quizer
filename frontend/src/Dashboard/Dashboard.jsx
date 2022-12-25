import { Backdrop, Box, Button, CircularProgress, Fab, Grid, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import React from "react";
import mainLogo from '../assets/mainLogo.png'
import SettingsIcon from '@mui/icons-material/Settings'
import DeleteIcon from '@mui/icons-material/Delete'
import EngineeringIcon from '@mui/icons-material/Engineering';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from "react-router-dom";
import axios from 'axios'
import sha256 from 'crypto-js/sha256';
import { useEffect } from "react";
import { useState } from "react";
import ServerAddress from '../assets/ServerAddress';

export default function Dashboard() {
  const {id,password} = useParams();
  const [userData,setUserData] = useState(false);

  useEffect(() => 
    {
      const getData = async() => {
        const res = await axios.get(ServerAddress(`user/connect/${id}/${password}`));
        if(typeof(res.data) === 'string' )
        {
          window.location.replace("/login");
        }
        else
        {
          setUserData(res.data);
        }
      }
      getData();
    },[]);

  return(<React.Fragment>
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={userData === false}>
      <CircularProgress color="inherit" />
    </Backdrop>
    <Tooltip title='הוסף מבחן'>
    <Fab variant='circular' sx={{position : 'absolute',left : '5vw',bottom : '5vh'}} color='secondary'>
      <AddIcon/>
    </Fab>
    </Tooltip>
   <Grid container sx={{padding:'20px'}}>
    <Grid item xs={2} sx={{display : 'flex',justifyContent : 'center'}}>
      היי {userData.firstName} {userData.lastName}
    </Grid>
    <Grid item xs={8}>
      <Box sx={{
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        padding : "20px",
      }}>

      <EngineeringIcon sx={{background : '#BD9CE9', padding : '10px',borderRadius: '50%',fontSize : '64px'}}/>
      <Typography variant='h4'>
        מערכת ניהול בחנים
      </Typography>
      </Box>
    </Grid>
    <Grid item xs={2}>
      <img src={mainLogo} style={{width : '10vw',aspectRatio : 'auto',margin : 'auto'}}/>
    </Grid>
    <Grid item xs={12}>
      <TestsList/>
    </Grid>
  </Grid>
  </React.Fragment>);
}
 
const TestsList = () => 
{
  const tests = [1,2,3,4];
  return <Box sx={{
    margin : 'auto',
    width : '80vw',
    display : 'flex',
    flexDirection : 'column',
    rowGap : 2,
  }}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">המבחנים שלי</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='caption'>
          שם המבחן
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='caption'>
          מספר הגשות
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='caption'>
          נפתח לאחרונה
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='caption'>
          ממוצע ציונים
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='caption'>
          פעולות
        </Typography>
      </Grid>
      {
        tests.map((e,index) => {
          return <TestItem key={index}/>
        })
      }
    </Grid>
  </Box>
}

const TestItem = () => {
  return <React.Fragment>
      <Grid item xs={3}>
        <Typography variant='caption'>
          <Skeleton variant='text'/>
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='caption'>
          <Skeleton variant='text'/>
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='caption'>
          <Skeleton variant='text'/>
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant='caption'>
          <Skeleton variant='text'/>
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <Tooltip title='הגדרות'>
          <SettingsIcon color='secondary'/>
        </Tooltip>
        <Tooltip title='מחק'>
          <DeleteIcon color='secondary' />
        </Tooltip>
      </Grid>
  </React.Fragment>
}