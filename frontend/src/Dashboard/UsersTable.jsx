import React, { useState } from "react";
import {DataGrid} from '@mui/x-data-grid';
import { useEffect } from "react";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Paper, Skeleton, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
function UsersTable({userId,password}) {
  return (
      <React.Fragment>
          <TableContainer component={Paper}>
              <Table>
                  <UsersTableHeader />
                  <UsersTableBody userId={userId} password={password} />
              </Table>
          </TableContainer>
    </React.Fragment>
  );
}

export default UsersTable;

const UsersTableHeader = () => {
    return (
        <TableHead>
            <TableCell>מספר מזהה</TableCell>
            <TableCell>שם פרטי</TableCell>
            <TableCell>שם משפחה</TableCell>
            <TableCell>הרשאות</TableCell>
            <TableCell>מחיקת משתמש</TableCell>
            <TableCell>תן הרשאת ניהול</TableCell>
        </TableHead>
    );
}

const UsersTableBody = ({ userId, password }) => {
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
            {rows.map((element, index) => <UsersTableRow {...element} />)}
        </TableBody>
    );
}

const UsersTableRow = ({ admin, firstName, lastName, userId }) => {
    return (
        <TableRow>
            <TableCell>{userId}</TableCell>
            <TableCell>{firstName}</TableCell>
            <TableCell>{lastName}</TableCell>
            <TableCell>{admin ? <SupervisorAccountIcon/> : <PersonIcon/>}</TableCell>
            <TableCell>
                <Button>
                    הפוך את {firstName} למנהל
                </Button>
            </TableCell>
            <TableCell>
                <Button>
                    מחק את {firstName}
                </Button>
            </TableCell>
        </TableRow>
    );
}
