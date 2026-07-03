import React from "react";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL

const FullImage = ({filename}) => {
  const [imageData, setImageData] = useState(null);
  
  useEffect(() => {
    if (!filename) return;

    const fetchImage = async () => {
      try {
        setImageData(`${API_BASE_URL}/image/${filename}`);
      } catch (err) {
        console.error('Error fetching image:', err);
      }
    };
    fetchImage();
  }, [filename]);

  if (!filename) 
    return <p>
      Select an image to display
      </p>;

  return (
    <div>
    {imageData ? (
        <img
          src={imageData}
          alt="Requested GridFS"
          style={{ height:"80vh", marginTop: "20px" }}
        />
      ) : <p>Loading Image ...</p>}
    </div>
  )
}

export default FullImage