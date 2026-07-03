import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UploadImage = ({username}) => {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFiles([...e.target.files])
  }
  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('user', username);

    try {
      const res = await axios.post(`${API_BASE_URL}/uploadImages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return<>
  {username ? <>
    <Typography>Here I will Implement a way to upload new images/ image folders</Typography>
    <Typography>It will need to get image(s), create thumbnails, upload to database, and display image</Typography>
    <input type="file" multiple onChange={handleChange} />
    <Button variant="outlined" onClick={handleUpload} >Upload Images</Button>
    </> :
    <Typography>Log in to upload images</Typography>}
  </>
}

export default UploadImage

