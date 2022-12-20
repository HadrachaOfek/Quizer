import React from 'react'
import {Box, Button, Step, StepLabel, Stepper, Typography, Input, TextField, TextareaAutosize, Paper} from '@mui/material'
import { useState } from 'react'

export default function CreateTestPage() {
    const [activeStep,setActiveStep] = useState(0);
    const steps = ["הגדרות מבחן","עריכת בנק שאלות","עריכת נבחנים"]
    return (
        <React.Fragment>
            <Paper variant='elevation' style={{padding : "10px",margin : "10px auto",width : "80vw"}}>
                <Stepper activeStep={activeStep} style={{direction : "rtl"}}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
                </Stepper>
                {
                    activeStep === 0 ? <TestConfigs/> : <QuestionsConfig/>
                }
                <Box sx={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between'}}>
                    <Button variant='contained' onClick={() => setActiveStep(activeStep + 1)}>הבא</Button>
                    <Button variant='outlined' onClick={() => setActiveStep(activeStep - 1)}>חזור</Button>
                </Box>
                </Paper>

        </React.Fragment>);
}

const TestConfigs = () =>
{
    const [title,setTitle] = useState(null);
    const [passingGrade,setPassingGrade] = useState(80);
    const [duration,setDuration] = useState(60);
    const [numOfQuestions,setNumOfQuestions] = useState(0);
    const [imgBuffer,setImgBuffer] = useState();
    console.log(imgBuffer);
    const loadFile =(file) =>
    {
        console.log(file);
        const reader = new FileReader();
        reader.addEventListener('load',_ => 
            {
                setImgBuffer(`data:${file.type};base64,${reader.result}`);
            })
        reader.readAsText(file);

    }
    return (
        <Box sx={{display : 'flex',flexDirection:'column',direction:'rtl',alignItems:'center',gap : "10px"}}>
            <Typography variant='h4'>
                הגדרות מבחן
            </Typography>
            <TextField variant='outlined' required helperText="מומלץ לספק שם מתאים" error={title === ""} fullWidth onChange={e => setTitle(e.target.value)} label="שם המבחן"/>
            <TextField variant='outlined'
                required
                helperText={`${Math.floor(duration/60)}:${duration%60 < 10 ? "0"+duration%60 : duration%60}`}
                fullWidth
                value={duration}
                onChange={e => setDuration(e.target.valueAsNumber)}
                type={'number'}
                label="משך המבחן (בדקות)"/>
            <TextField 
                variant='outlined' 
                fullWidth type='file' 
                onChange={e=>loadFile(e.target.files[0])}
                label="סמל מבחן"/>
                <img src={{uri : imgBuffer}} alt='preview'/>
            <TextField 
                variant='outlined' 
                fullWidth required 
                type='number' 
                onChange={e => setNumOfQuestions(e.target.valueAsNumber)} 
                label="מספר שאלות"/>
            <TextField 
                variant='outlined' 
                fullWidth type='number' 
                value={80} 
                onChange={e=>setPassingGrade(e.target.value)}
                label="ציון עובר"/>
            <TextField 
                variant='outlined'
                fullWidth multiline 
                rows={5} label="הוראות"/>
        </Box>
    )
}

const QuestionsConfig = () =>
{
    return (
        <Box>
            hello 2
        </Box>
    )
}

