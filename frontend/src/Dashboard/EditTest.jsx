import { Box, Paper } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import ServerAddress from "../assets/ServerAddress";

function EditTest() {
	const {id,testid,password} = useParams();
  return (
	<Box sx={{display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100vw' , height : '100vh'}}>
		<Paper>
			hello
		</Paper>
	</Box>
  );
}

export default EditTest;
