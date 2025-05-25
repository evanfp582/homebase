import React from "react";
import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import CardActionArea from '@mui/material/CardActionArea';
import axios from "axios";

const ImageGrid = ({setFullFilename}) => {
  const [allImgData, setAllImgData] = useState([]);
  const [thumbDict, setThumbDict] = useState(null);
  const [localFilename, setLocalFilename] = useState("");

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

  const handleClick = (fullFilename) => {
    // e.preventDefault();
    setFullFilename(fullFilename);
    setLocalFilename(fullFilename);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

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
          <CardActionArea
            onClick={() => handleClick(image.filename)}
            data-active={localFilename === image.filename ? true : undefined}
            sx={{
              height: '100%',
              '&[data-active]': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selectedHover',
                },
              },
            }}
          ><CardContent>
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
            </CardContent></CardActionArea>
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


export default ImageGrid