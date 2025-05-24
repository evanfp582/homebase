import React, { useState, createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import ImageCard from "./components/ImageGrid";
import Separator from "./components/Separator";
import Navbar from "./components/Navbar";
import FullImage from "./components/FullImage";

export const ThemeContext = createContext();

const initialTheme = {
  primaryColor: { r: 198, g: 40, b: 40 },
  secondaryColor: { r: 239, g: 108, b: 0 },
  textColor: { r: 238, g: 238, b: 238 },
  secondaryTextColor: { r: 97, g: 97, b: 97 },
  backgroundColor: { r: 238, g: 238, b: 238 },
  paperColor: {r: 224, g: 224, b: 224}
}

function App() {
  const [primaryColor, setPrimaryColor] = useState(initialTheme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialTheme.secondaryColor);
  const [textColor, setTextColor] = useState(initialTheme.textColor);
  const [secondaryTextColor, setSecondaryTextColor] = useState(initialTheme.secondaryTextColor);
  const [backgroundColor, setBackgroundColor] = useState(initialTheme.backgroundColor);
  const [paperColor, setPaperColor] = useState(initialTheme.paperColor)

  const [selectedFilename, setSelectedFilename] = useState(null);

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: `rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})`,
      },
      secondary: {
        main: `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`,
      },
      text: {
        header: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
        secondary: `rgb(${secondaryTextColor.r}, ${secondaryTextColor.g}, ${secondaryTextColor.b})`,
      },
      error: {
        main: "#9c9c9c",
      },
      warning: {
        main: "#e8df56",
      },
      background: {
        default: `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`,
        paper: `rgb(${paperColor.r}, ${paperColor.g}, ${paperColor.b})`,
      },
    },
    typography: {
      fontFamily: "Oswald",
    },
  });

  return (
    <ThemeContext.Provider value={{ 
      setPrimaryColor, primaryColor,
      setSecondaryColor, secondaryColor,
      setTextColor, textColor,
      setSecondaryTextColor, secondaryTextColor,
      setBackgroundColor, backgroundColor,
      setPaperColor, paperColor
    }}>
      <ThemeProvider theme={theme}>
        <div className="App" style={{backgroundColor: 'rgb(238, 238, 238)'}}>
          <Navbar setFullFilename={setSelectedFilename}/>
          <FullImage filename={selectedFilename}/>
          <Separator />
          <ImageCard />
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
