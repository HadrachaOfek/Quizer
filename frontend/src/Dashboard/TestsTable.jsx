import { Alert, CircularProgress, IconButton, LinearProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
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

function TestsTable({userId,password,setSnackbarOpen,setSnackbarSeverity,setSnackbarMessage}) {
    const [data, setData] = useState(null);
    
    
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
    }, []);
    
    const activateTest = async (testId) => {
        const res = await axios.patch(ServerAddress(`test/activate_test/${userId}/${password}/${testId}`));
        if (res.data[0])
        {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('success');
            setSnackbarOpen(true)
            fetchData();
        }
        else {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('error');
            setSnackbarOpen(true)
        }
    }

    const deleteTest = async (testId) => {
        const res = await axios.delete(ServerAddress(`test/delete_test/${userId}/${password}/${testId}`));
        if (res.data[0])
        {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('success');
            setSnackbarOpen(true)
            fetchData();
        }
        else {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('error');
            setSnackbarOpen(true)
        }
    }



    const deactivateTest = async (testId) => {
        const res = await axios.patch(ServerAddress(`test/deactivate_test/${userId}/${password}/${testId}`));
        if (res.data[0])
        {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('success');
            setSnackbarOpen(true)
            fetchData();
        }
        else {
            setSnackbarMessage(res.data[1]);
            setSnackbarSeverity('error');
            setSnackbarOpen(true)
        }
    }

    const editTest = (testid) => {
        window.location.replace(`/dashboard/edit_questions/${userId}/${password}/${testid}`)
    }

    return (
        <React.Fragment>
        <TableContainer component={Paper}>
            <Table size='small'>
                <TableHeader/>
            <TableBody>
        {data === null ? <LinearProgress/> : (data.map((item,index)=> <TestsTableRow key={index} {...item} editTest={editTest} deleteTest={deleteTest} deactivateTest={deactivateTest} activateTest={activateTest} />))}
    </TableBody>
  </Table>
            </TableContainer>
            </React.Fragment>);
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

const TestsTableRow = ({title,active,password,activateTest,deactivateTest,_id,deleteTest,editTest}) => {
    return(
            <TableRow>
                <TableCell>{title}</TableCell>
                <TableCell>0</TableCell>
                <TableCell><CircleIcon htmlColor={active ? 'green' : 'red'}/></TableCell>
                <TableCell>{password}</TableCell>
                <TableCell>
                    <Tooltip title='מחיקת מבחן' onClick={e=> deleteTest(_id)}>
                        <IconButton color='primary'>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                <Tooltip title={active ? 'כבה' : 'הדלק'} onClick={e => active ? deactivateTest(_id) :activateTest(_id)}>
                        <IconButton color='primary'>
                            <PowerSettingsNewIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='הגדרות' onClick={e=>editTest()}>
                        <IconButton color='primary' >
                            <Settings/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
    )
}