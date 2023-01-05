import React, { useState } from "react";
import {DataGrid} from '@mui/x-data-grid';
import { useEffect } from "react";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Button, CircularProgress, IconButton, Modal, Paper, Skeleton, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { SHA256 } from "crypto-js";
function UsersTable({ userId, password,setSnackbarSeverity,setSnackbarOpen,setSnackbarMessage }) {
    const [userToDelete, setUserDelete] = useState(false)
    const [userToAdmin, setUserToAdmin] = useState(false)
    const [userToChangePassword,setUserToChangePassword] = useState(false)
  return (
      <React.Fragment>
          <Modal open={userToChangePassword}>
              <ResetPasswordPrompt adminId={userId} userId={userToChangePassword} close={() => setUserToChangePassword(false)} adminPassword={password} />
          </Modal>
          <Modal open={userToDelete}>
              <DeleteUserPrompt adminId={userId} userId={userToDelete} close={() => setUserDelete(false)} adminPassword={password} setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} setSnackbarSeverity={setSnackbarSeverity} />
          </Modal>
          <Modal open={userToAdmin}>
              <UserToAdminPrompt adminId={userId} userId={userToAdmin} close={() => setUserToAdmin(false)} adminPassword={password} setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} setSnackbarSeverity={setSnackbarSeverity} />
          </Modal>
          <TableContainer component={Paper}>
              <Table>
                  <UsersTableHeader />
                  <UsersTableBody userId={userId} setUserToAdmin={setUserToAdmin} ResetUserPasseord={setUserToChangePassword} DeleteUser={setUserDelete} password={password}  />
              </Table>
          </TableContainer>
    </React.Fragment>
  );
}

export default UsersTable;

const ResetPasswordPrompt = ({ adminId,adminPassword,userId,close}) =>
{
    const [newPassword, setNewPassword] = useState(false)
    const [load, setLoad] = useState(false);
    const digits = 9;
    useEffect(() => {
        setNewPassword((Math.floor(Math.random() * Math.pow(10, digits))));
    }, [])
    
    const Confirme = async () =>
    {
        setLoad(true);
        const res = await axios.patch(ServerAddress(`user/reset_password/${adminId}/${adminPassword}/${userId}/${SHA256(newPassword).toString()}`))
        if (res.status === 200)
        {
            if (res.data[0]) {
                console.log(res.data[1]);
            }
            else {
                console.log(res.data[1]);
            }
        }
        close();
    }
    return (
        <Paper sx={{position : 'absolute',top: '50%',
        left: '50%', width : '20vw',height : '30vw',minHeight : '300px',minWidth : '300px',padding : '10px',
            transform: 'translate(-50%, -50%)',display:'flex',flexDirection : 'column',alignItems : 'center',justifyContent:'space-evenly'
        }} >
            {load ? <CircularProgress/> :
            (<React.Fragment><Typography variant='h4'>
                הסיסמה החדשה היא
            </Typography>
            {newPassword ? 
                <Typography variant='h3' align='center'>
                    {newPassword}
                </Typography> :
                <Skeleton variant='rectangular' width={200} />
            }
            <Box sx={{display : 'flex',width : '100%',justifyContent : 'space-between',gap : '10px'}}>
                        <Button color='primary' variant='contained' fullWidth onClick={e => Confirme()}>
                            אפס סיסמה
                        </Button>
                        <Button color='secondary' variant='outlined' fullWidth onClick={e => close()}>
                            בטל
                        </Button>
            </Box>
                </React.Fragment>)
            }
        </Paper>
    )
}
    
const DeleteUserPrompt = ({ adminId,adminPassword,userId,close,setSnackbarSeverity,setSnackbarOpen,setSnackbarMessage}) =>
{
    const [load, setLoad] = useState(false);
    const [password, setPassword] = useState("");
    const Confirme = async () =>
    {
        if (SHA256(password).toString() == adminPassword) {
            setLoad(true);
            const res = await axios.delete(ServerAddress(`user/delete/${adminId}/${adminPassword}/${userId}`))
            if (res.status === 200) {
                if (res.data[0]) {
                    setSnackbarSeverity('success')
                    setSnackbarMessage('משתמש נמחק בהצלחה');
                }
                else {
                    setSnackbarSeverity('error')
                    setSnackbarMessage(res.data[1]);
                }
            }
            else {
                setSnackbarSeverity('warning')
                setSnackbarMessage("אירע בעיה עם השרת");
            }
            close();
        }
        else {
            setSnackbarSeverity('error');
            setSnackbarMessage('סיסמה שגוייה');
        }
        setSnackbarOpen(true);
    }
    return (
        <Paper sx={{position : 'absolute',top: '50%',
        left: '50%', width : '20vw',height : '20vw',minHeight : '300px',minWidth : '300px',padding : '10px',
            transform: 'translate(-50%, -50%)',display:'flex',flexDirection : 'column',alignItems : 'center',justifyContent:'space-evenly'
        }}>
            {load ? <CircularProgress/> :
                (<React.Fragment>
                    <Typography variant='h4'>
                        למחיקת המשתמש נא להזין סיסמה
                    </Typography>
                    <TextField type='password' fullWidth label='סיסמה' onChange={e=> setPassword(e.target.value)}/>
                    <Box sx={{display : 'flex',width : '100%',justifyContent : 'space-between',gap : '10px'}}>
                        <Button color='primary' variant='contained' fullWidth onClick={e => Confirme()}>
                            מחק וסגור
                        </Button>
                        <Button color='secondary' variant='outlined' fullWidth onClick={e => close()}>
                            בטל
                        </Button>
                    </Box>
                </React.Fragment>)
            }
        </Paper>
    )
}
    
const UserToAdminPrompt =  ({ adminId,adminPassword,userId,close,setSnackbarSeverity,setSnackbarOpen,setSnackbarMessage}) =>
{
    const [load, setLoad] = useState(false);
    const [password, setPassword] = useState("");
    const Confirme = async () =>
    {
        if (SHA256(password).toString() == adminPassword) {
            setLoad(true);
            const res = await axios.patch(ServerAddress(`user/set_admin/${adminId}/${adminPassword}/${userId}`))
            if (res.status === 200) {
                if (res.data[0]) {
                    setSnackbarSeverity('success')
                    setSnackbarMessage('עודכן כמנהל');
                }
                else {
                    setSnackbarSeverity('error')
                    setSnackbarMessage(res.data[1]);
                }
            }
            else {
                setSnackbarSeverity('warning')
                setSnackbarMessage("אירע בעיה עם השרת");
            }
            close();
        }
        else {
            setSnackbarSeverity('error');
            setSnackbarMessage('סיסמה שגוייה');
        }
        setSnackbarOpen(true);
    }
    return (
        <Paper sx={{position : 'absolute',top: '50%',
        left: '50%', width : '20vw',height : '20vw',minHeight : '300px',minWidth : '300px',padding : '10px',
            transform: 'translate(-50%, -50%)',display:'flex',flexDirection : 'column',alignItems : 'center',justifyContent:'space-evenly'
        }} >
            {load ? <CircularProgress/> :
                (<React.Fragment>
                    <Typography variant='h4'>
                        להפיכת המשתמש למנהל יש להזין סיסמה
                    </Typography>
                    <TextField type='password' fullWidth label='סיסמה' onChange={e=> setPassword(e.target.value)}/>
                    <Box sx={{display : 'flex',width : '100%',justifyContent : 'space-between',gap : '10px'}}>
                        <Button color='primary' variant='contained' fullWidth onClick={e => Confirme()}>
                            אשר וסגור
                        </Button>
                        <Button color='secondary' variant='outlined' fullWidth onClick={e => close()}>
                            בטל
                        </Button>
                    </Box>
                </React.Fragment>)
            }
        </Paper>
    )
}

const UsersTableHeader = () => {
    return (
        <TableHead>
            <TableCell>מספר מזהה</TableCell>
            <TableCell>שם פרטי</TableCell>
            <TableCell>שם משפחה</TableCell>
            <TableCell>הרשאות</TableCell>
            <TableCell>פעולות</TableCell>
        </TableHead>
    );
}

const UsersTableBody = ({ userId, password,ResetUserPasseord,DeleteUser,setUserToAdmin }) => {
    const [rows, setRows] = useState([]);
    useEffect(()=>{
        const fetchUsersData = async () =>
        {
            const res = await axios.get(ServerAddress(`user/get_all/${userId}/${password}`));
            if(res.data)
            {
                setRows(res.data);
            }
        }
        fetchUsersData();
    }, [])

    
    return (
        <TableBody>
            {rows.map((element, index) => <UsersTableRow key={index} {...element} setUserToAdmin={setUserToAdmin} ResetUserPasseord={ResetUserPasseord} DeleteUser={DeleteUser} />)}
        </TableBody>
    );
}

const UsersTableRow = ({ admin, firstName, lastName, userId,ResetUserPasseord,DeleteUser,setUserToAdmin }) => {
    return (
        <TableRow>
            <TableCell>{userId}</TableCell>
            <TableCell>{firstName}</TableCell>
            <TableCell>{lastName}</TableCell>
            <TableCell>{admin ? <SupervisorAccountIcon/> : <PersonIcon/>}</TableCell>
            <TableCell>
                {admin ? undefined :
                    <React.Fragment>
                    <Tooltip title='הפוך למנהל'>
                        <IconButton onClick={e=> setUserToAdmin(userId)}>
                            <GroupAddIcon color='primary' />
                        </IconButton>
                    </Tooltip>
                
                    <Tooltip title='מחק משתמש'>
                      
                            <IconButton onClick={e => DeleteUser(userId)}>
                            <DeleteForeverIcon color='primary' />
                        </IconButton>
                        </Tooltip>
                        </React.Fragment>
                }
                <Tooltip title='החלף סיסמה'>
                    <IconButton onClick={e=> ResetUserPasseord(userId)}>
                        <LockResetIcon color='primary'/>
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}
