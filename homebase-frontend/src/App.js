import React from "react";
import { useState } from "react";
import "./App.css";
import ImageCard from "./components/ImageGrid";
import { Typography } from "@mui/material";
import Separator from "./components/Separator";

function App() {
  const [filename, setFilename] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setImgSrc(`http://localhost:5000/image/${filename}`);
  };

  return (
    <div className="App">
      <div style={{"min-height":"100vh"}}>
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        Evan Images
      </Typography>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Enter image filename"
        />
        <button type="submit">View Image</button>
      </form>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Requested GridFS"
          style={{ height:"80vh", marginTop: "20px" }}
        />
      )}
      </div>
      < Separator />
      <ImageCard />
    </div>
  );
}

export default App;
