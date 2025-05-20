import React from "react";
import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";

const ImageCard = () => {
  const [allImgData, setAllImgData] = useState([]);
  const [thumbSrc, setThumbSrc] = useState(null);

  useEffect(() => {
    const fetchThumbnail = async () => {
      const TEMP_ID = "68211c429e72e61715d2ae16"
      try {
        const res = await axios.get(`http://localhost:5000/image/id/${TEMP_ID}`, {
          responseType: 'blob', // Important: we expect binary data
        });

        const url = URL.createObjectURL(res.data);
        setThumbSrc(url);
      } catch (error) {
        console.error("Failed to load thumbnail:", error);
      }
    };

    fetchThumbnail();
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
      {thumbSrc ? 
          <img src={thumbSrc} alt="Thumbnail" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        : <p>Loading thumbnail...</p>
      };
      <Grid container spacing={4} sx={{ padding: "4rem" }}>
      {allImgData && allImgData.map((image, index) => (
        <Grid item md={3} size={2} key={index}>
          <Card>
            <CardContent>
              <Typography sx={{ textAlign: "center" }}>
                {image.filename}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  </>)
}

export default ImageCard