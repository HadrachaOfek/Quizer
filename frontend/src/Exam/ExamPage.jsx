import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import lll from '../assets/mainLogo.png';
import MultipalChoise from "./MultipalChoise";
import SingleChoise from "./SingleChoise";

function ExamPage() {
    const { userId, testId } = useParams();
    const [testData, setTestData] = useState([0]);
    const radius = '50px'

    useEffect(() => { 
        const loadData = async () => {
            const res = { data: true };
            if (!res.data)
            {
                window.location.replace('/exam_test_close_screen');
            }
                
        }
        loadData();
    },[])
    return (
        <React.Fragment>
            <Paper sx={{ position: 'fixed',display : 'flex', justifyContent:'space-between', width: '70vw',margin:'0px auto',left : '15vw',top:'0px',padding : '5px ' + radius,height : '100px',borderRadius : `0px 0px ${radius} ${radius}`}}>
                <img src={lll}  height='64' />
                <Typography variant='h2'>שם המבחן</Typography>
                <Clock endDate={Date.now() + 1000*60*60}/>
            </Paper>
            <Paper sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '70vw', margin: '125px auto 0px', padding: radius + ' 20px', borderRadius: radius }}>
                <MultipalChoise answers={[0, 1, 2, 3, 4]} question={"אני אשאל שאלה"}  />
                <SingleChoise/>
            </Paper>

        </React.Fragment>
  );
}

export default ExamPage;


const Clock = ({ endDate }) => {
    const [newDatem,setNewDate] = useState(Date.now());
    useEffect(() => {
        if ( endDate - newDatem >= 0) {
            setTimeout(() => setNewDate(Date.now()), 1000)
        }
        else {
            alert("test end");
        }
    }, [newDatem])
    const hh = Math.floor((endDate - newDatem) / (1000 * 60 * 60));
    const mm = Math.floor(((endDate - newDatem) / (1000 * 60)) % 60);
    const ss = Math.floor(((endDate - newDatem) / (1000))%(60));
    return (
        <Typography variant='h3'>{ endDate - newDatem >= 0 ? hh + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0"+ss : ss ) : "00:00:00"}</Typography>
    )
}