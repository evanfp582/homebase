import React from "react";
import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import axios from "axios";

const ImageCard = () => {
  const [allImgData, setAllImgData] = useState([]);
  const [thumbDict, setThumbDict] = useState(null);

  useEffect(() => {
    const fetchAllThumbnails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/thumbnails`);
        setThumbDict(arrayToDict(res.data));
      } catch (error) {
        console.error("Failed to get thumbnails:", error);
      }
    };
    fetchAllThumbnails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/findall/0");
        setAllImgData(res.data);
      } catch (err) {
        console.error("Error fetching image data:", err);
      }
    }
    fetchData();
  }, []);

  return(<>
  <Box
      id="projects"
      sx={{
        backgroundColor: "background.default",
      }}
    >
      <Grid container spacing={4} sx={{ padding: "4rem" }}>
      {allImgData && allImgData.map((image, index) => (
        <Grid item md={3} size={2} key={index}>
          <Card>
            <CardContent>
              <Typography sx={{ textAlign: "center" }}>
                {image.filename}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                {image._id}
              </Typography>
              {thumbDict && thumbDict[image._id] ? 
                <img 
                  src={`data:image/jpeg;base64,${thumbDict[image._id]["thumbnail"]}`}
                  alt="Thumbnail"></img>
                : <p>Thumbnail Not Found.</p>
              }
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  </>)
}

function arrayToDict(thumbnailsArray) {
  const dict = {};
  thumbnailsArray.forEach(doc => {
    const key = doc.originalFileId.toString();
    dict[key] = doc;
  });
  return dict;
}


export default ImageCard