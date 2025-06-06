import { Typography } from "@mui/material";


const UploadImage = ({username}) => {
  return<>
  {username ? <>
    <Typography>Here I will Implement a way to upload new images/ image folders</Typography>
    <Typography>It will need to get image(s), create thumbnails, upload to database, and display image</Typography></> :
    <Typography>Log in to upload images</Typography>}
  </>
}

export default UploadImage

