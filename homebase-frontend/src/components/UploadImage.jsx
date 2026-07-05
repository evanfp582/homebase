import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UploadImage = ({username}) => {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    console.log(...e.target.files)
    setFiles([...e.target.files])
  }
  const handleUpload = async () => {
    console.log("username: ", username);
    
    const formData = new FormData();
    formData.append('username', username)
    formData.append('image', files[0])
    const jsonData = {'username': username, 'image': files[0]}

    try {
      const res = await axios.post(`${API_BASE_URL}/uploadImages`, {jsonData}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return<>
  {/* {username ? <> */}
    <Typography>Here I will Implement a way to upload new images/ image folders</Typography>
    <Typography>It will need to get image(s), create thumbnails, upload to database, and display image</Typography>
    {/* <input type="file" multiple onChange={handleChange} />
    <Button variant="outlined" onClick={handleUpload} >Upload Images</Button>
    </> :
    <Typography>Log in to upload images</Typography>} */}
  </>
}

export default UploadImage

