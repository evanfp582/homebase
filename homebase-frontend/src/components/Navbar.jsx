import React from "react";
import { useState } from "react";
import { Typography } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Login from "./Login";

const Navbar = ({setFullFilename, setUsername}) => {
  const [filename, setFilename] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    setFullFilename(filename);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return(
    <AppBar position="sticky">
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        Evan Images
      </Typography>
      <form onSubmit={handleClick}>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter image filename"
        />
        <button type="submit">View Image</button>
      </form>
      <Login setActualUsername={setUsername}/>
    </AppBar>
  )
}

export default Navbar