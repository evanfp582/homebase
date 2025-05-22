// Taken from my evanfp582.github.io project
import { Box } from "@mui/material";

const Separator = ({ width = "95%" }) => {
return (
  <Box
    sx={{
      borderBottom: "3px solid rgb(197, 139, 14)",
      width: width,
      margin: "auto",
    }}
  />
)
}

export default Separator 

