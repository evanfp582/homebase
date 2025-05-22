import React from "react";
import { useState } from "react";
import "./App.css";
import ImageCard from "./components/image_card";
import { Typography } from "@mui/material";

function App() {
  const [filename, setFilename] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setImgSrc(`http://localhost:5000/image/${filename}`);
  };

  return (
    <div className="App">
      <Typography variant="h1" color="primary" sx={{ fontWeight: "bold" }}>
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
        <div>
          <h2>Result:</h2>
          <img
            src={imgSrc}
            alt="Requested GridFS"
            style={{ height:550, marginTop: "20px" }}
          />
        </div>
      )}
      <ImageCard />
    </div>
  );
}

export default App;
