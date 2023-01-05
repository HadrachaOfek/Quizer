import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

function MultipalChoise({answers,question,image}) {
    const [checked, setChecked] = useState([]);

    const toogleAnswer = (str) => {
        if (checked.indexOf(str) === -1) {
            setChecked(checked.concat([str]));
        }
        else {
            setChecked(checked.filter(s => s !== str));
        }
    }
    return (<Box sx={{ display: 'flex', flexDirection: 'column', margin: '20px 0px' }}>
        <Typography variant='caption'>
            {question}
        </Typography>
        
        {answers.map((ans, index) => {
            return <Button key={index} variant={checked.indexOf(ans) === -1 ? 'outlined' : 'contained'}  size='large' sx={{ margin: '5px 0px' }} onClick={ e => toogleAnswer(ans)}>{ ans}</Button>
        })}
    </Box>);
}

export default MultipalChoise;
