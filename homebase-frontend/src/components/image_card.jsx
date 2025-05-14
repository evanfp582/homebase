import React from "react";
import { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";

const ImageCard = () => {
  const [allImgData, setAllImgData] = useState([]);

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

  const images = [
    {
      "_id": "681bcaeb58e6c5000fb21c80",
      "length": 19096170,
      "chunkSize": 261120,
      "uploadDate": "2025-05-07T21:04:44.103Z",
      "filename": "BolandJ_090222_639.jpg",
      "metadata": {}
    },
    {
      "_id": "68210d12fea1b2b99519474c",
      "filename": "Kyaking.jpg",
      "chunkSize": 261120,
      "length": 1524185,
      "uploadDate": "2025-05-11T20:48:19.155Z"
    },
    {
      "_id": "68210d13fea1b2b995194753",
      "filename": "RedneckSafari.jpg",
      "chunkSize": 261120,
      "length": 6991453,
      "uploadDate": "2025-05-11T20:48:20.277Z"
    },
    {
      "_id": "68211c429e72e61715d2acbc",
      "filename": "20210803_082008.jpg",
      "chunkSize": 261120,
      "length": 8911195,
      "uploadDate": "2025-05-11T21:53:06.148Z"
    },
    {
      "_id": "68211c429e72e61715d2ace0",
      "filename": "20230730_103033.jpg",
      "chunkSize": 261120,
      "length": 10092749,
      "uploadDate": "2025-05-11T21:53:06.186Z"
    },
    {
      "_id": "68211c429e72e61715d2ad08",
      "filename": "20241128_135845.jpg",
      "chunkSize": 261120,
      "length": 8530689,
      "uploadDate": "2025-05-11T21:53:06.218Z"
    },
    {
      "_id": "68211c429e72e61715d2ad2a",
      "filename": "20230730_103040.jpg",
      "chunkSize": 261120,
      "length": 10528768,
      "uploadDate": "2025-05-11T21:53:06.261Z"
    },
    {
      "_id": "68211c429e72e61715d2ad54",
      "filename": "20230612_224041.jpg",
      "chunkSize": 261120,
      "length": 9137925,
      "uploadDate": "2025-05-11T21:53:06.296Z"
    },
    {
      "_id": "68211c429e72e61715d2ad78",
      "filename": "20250225_223126.jpg",
      "chunkSize": 261120,
      "length": 12562631,
      "uploadDate": "2025-05-11T21:53:06.347Z"
    },
    {
      "_id": "68211c429e72e61715d2adaa",
      "filename": "20231009_212000.jpg",
      "chunkSize": 261120,
      "length": 8769754,
      "uploadDate": "2025-05-11T21:53:06.380Z"
    }
  ]

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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    </Box>
  </>)
}

export default ImageCard