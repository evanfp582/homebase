import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UploadImage = ({username}) => {
  const [file, setFile] = useState(null);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('image', file, file.name);
    axios
      .post(`${API_BASE_URL}/api/image/upload`, fd, {
      })
      .then(({ data }) => {
        setFile(null);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          const errMsg = err.response.data;
          if (errMsg) {
            console.log(errMsg);
            alert(errMsg);
          }
        } else if (err.response.status === 500) {
          console.log('db error');
          alert('db error');
        } else {
          console.log('other error: ', err);
        }
      });
  };

  return<>
  {username ? <>
    <Typography>Here I will Implement a way to upload new images/ image folders</Typography>
    <Typography>It will need to get image(s), create thumbnails, upload to database, and display image</Typography>
    <input type="file" multiple onChange={handleFile} />
    <Button variant="outlined" onClick={fileUploadHandler} >Upload Images</Button>
    </> :
    <Typography>Log in to upload images</Typography>}
  </>
}

export default UploadImage

