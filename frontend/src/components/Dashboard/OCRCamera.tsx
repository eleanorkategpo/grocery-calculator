import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { Button, Box, Typography } from "@mui/material";

const OCRCamera = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [ocrResult, setOcrResult] = useState("");

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      Tesseract.recognize(
        imageSrc,
        "eng",
        {
          logger: (m) => console.log(m), // Optional: log progress
        }
      ).then(({ data: { text } }) => {
        setOcrResult(text);
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        height={300}
      />
      <Button variant="contained" color="primary" onClick={capture}>
        Capture and Scan
      </Button>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Close
      </Button>
      {ocrResult && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">OCR Result:</Typography>
          <Typography>{ocrResult}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default OCRCamera; 