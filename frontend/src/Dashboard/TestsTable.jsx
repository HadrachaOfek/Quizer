import { CircularProgress, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import axios from "axios";
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ServerAddress from "../assets/ServerAddress";
import { green, red } from "@mui/material/colors";
import Settings from "@mui/icons-material/Settings";

function TestsTable({userId,password}) {
    const [data,setData] = useState(null);
    
    
    const fetchData = async() => {
        const res = await axios.get(ServerAddress(`test/get_all/${userId}/${password}`))
        if(res.data)
        {
            setData(res.data);
        }
        else
        {
            setData([]);
        }
    }
    
    useEffect(() => {
        fetchData()
    },[]);

  return (
    <TableContainer component={Paper}>
    <Table size='small'>
    <TableHeader/>
    <TableBody>
        {data === null ? <LinearProgress/> : (data.map((item,index)=> <TestsTableRow key={index} {...item} />))}
    </TableBody>
  </Table>
  </TableContainer>);
}

export default TestsTable;


const TableHeader = () => {
    return(
        <TableHead>
            <TableRow>
                <TableCell>שם המבחן</TableCell>
                <TableCell>מספר משיבים</TableCell>
                <TableCell>פעיל</TableCell>
                <TableCell>קוד כניסה</TableCell>
                <TableCell>פעולות</TableCell>
            </TableRow>
        </TableHead>
    )
}

const TestsTableRow = ({title,active,password}) => {
    return(
            <TableRow>
                <TableCell>{title}</TableCell>
                <TableCell>0</TableCell>
                <TableCell><CircleIcon htmlColor={active ? 'green' : 'red'}/></TableCell>
                <TableCell>{password}</TableCell>
                <TableCell>
                    <Tooltip title='מחיקת מבחן'>
                        <IconButton color='primary'>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={active ? 'כבה' : 'הדלק'}>
                        <IconButton color='primary' >
                            <PowerSettingsNewIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='הגדרות'>
                        <IconButton color='primary' >
                            <Settings/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
    )
}