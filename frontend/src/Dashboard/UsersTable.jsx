import React, { useState } from "react";
import {DataGrid} from '@mui/x-data-grid';
import { useEffect } from "react";
import axios from "axios";
import ServerAddress from "../assets/ServerAddress";
import { Box, Button, Skeleton } from "@mui/material";
function UsersTable({userId,password}) {
    const [rows,setRows] = useState(null);
    
    const columns=[
        { field: 'id', headerName: 'מספר מזהה' },
        { field: 'firstName', headerName: 'שם פרטי' },
        { field: 'lastName', headerName: 'שם משפחה' },
        {
            field : 'admin',
            headerName : 'הראשאות ניהול',
        },
      ];

    useEffect(()=>{
        const fetchUsersData = async () =>
        {
            const res = await axios.get(ServerAddress(`user/${userId}/${password}`));
            if(res.data)
            {
                const temp = [];
                res.data.map(e => 
                    temp.push({
                        id : e.userId,
                        firstName : e.firstName,
                        lastName : e.lastName,
                        password : e.password,
                        admin : e.admin
                    }));
                setRows(temp);
            }
        }
        fetchUsersData();
    },[])
  return (
    <React.Fragment>
        <Box>
            { rows ? <DataGrid
            columns={columns}
            rows={rows}
            pageSize={5}
            autoHeight

            onCellClick={e=>console.log(e)}
            onSelectionModelChange={e=>console.log(e)}
            rowsPerPageOptions={[5]}
            checkboxSelection
            /> : <Skeleton variant='rectangular' width='100%'/>}
        </Box>
    </React.Fragment>
  );
}

export default UsersTable;
