import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [filename, setFilename] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setImgSrc(`http://localhost:5000/image/${filename}`);
  };

  return (
    <div className="App">
      <h1>GridFS Image Viewer</h1>
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
            style={{ maxWidth: "100%", height: "auto", marginTop: "20px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
