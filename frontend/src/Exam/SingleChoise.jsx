import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

function SingleChoise() {
    const answers = [0, 1, 2,3, 4];
    const question = "hello this is a question"
    const [checked, setChecked] = useState("");

    const toogleAnswer = (str) => {
        setChecked(str);
    }
    return (<Box sx={{ display: 'flex', flexDirection: 'column', margin : '20px 0px' }}>
        <Typography variant='caption'>
            {question}
        </Typography>
        {answers.map((ans, index) => {
            return <Button key={index} variant={checked !== ans ? 'outlined' : 'contained'}  size='large' sx={{ margin: '5px 0px' }} onClick={ e => toogleAnswer(ans)}>{ ans}</Button>
        })}
    </Box>);
}

export default SingleChoise;
