import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import {
  Button,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  IconButton
} from "@mui/material";
import { CameraAlt, FileUpload } from "@mui/icons-material";

const OCRCamera = () => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ocrResult, setOcrResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraAvailable, setCameraAvailable] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [streamActive, setStreamActive] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);

  // Check browser support for getUserMedia
  useEffect(() => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setBrowserSupported(false);
      setCameraError(
        "Your browser doesn't support camera access. Try using a modern browser or upload an image instead."
      );
      return;
    }

    // Check if we're on HTTPS (required for getUserMedia on most browsers)
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      setCameraError(
        "Camera access requires HTTPS. Please use a secure connection."
      );
      return;
    }

    // Check Safari specific issues
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // Safari has special requirements for camera access
      console.log(
        "Safari detected, may need special handling for camera access"
      );
    }

    let cameraStream: MediaStream | null = null;

    const requestCameraPermission = async () => {
      try {
        // First stop any existing streams to force a new permission request
        if (webcamRef.current && webcamRef.current.video) {
          const existingStream = webcamRef.current.video
            .srcObject as MediaStream;
          if (existingStream) {
            existingStream.getTracks().forEach((track) => track.stop());
            webcamRef.current.video.srcObject = null;
          }
        }

        // Request camera with specific constraints that work well on iOS
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        cameraStream = stream;
        setCameraAvailable(true);
        setStreamActive(true);
        setCameraError("");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(
          `Camera access denied: ${
            (err as Error).message
          }. Please grant permission or use the upload option.`
        );
        setCameraAvailable(false);
        setStreamActive(false);
      }
    };

    // Only request permission if browser is supported
    if (browserSupported) {
      requestCameraPermission().catch((err) => {
        console.error("Failed to request camera permission:", err);
      });
    }

    // Clean up function
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.srcObject
      ) {
        const stream = webcamRef.current.video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      setStreamActive(false);
    };
  }, [browserSupported]);

  // Handle file upload as alternative to camera
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageSrc = e.target?.result as string;

      try {
        const result = await Tesseract.recognize(imageSrc, "eng", {
          logger: (m) => console.log(m),
        });

        const text = result.data.text;
        setOcrResult(text);

        if (text) {
          // Extract barcode from text if needed
          const barcodeMatch = text.match(/\d+/); // Simple regex to find first number sequence
          if (barcodeMatch) {
            console.log("Detected barcode:", barcodeMatch[0]);
            // You can use this value where needed
          }
        }
      } catch (error) {
        console.error("OCR failed:", error);
        setOcrResult("Error processing image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setOcrResult("Error reading file. Please try another image.");
    };

    reader.readAsDataURL(file);
  };

  const capture = async () => {
    if (!browserSupported) {
      // If browser doesn't support camera, trigger file upload instead
      fileInputRef.current?.click();
      return;
    }

    // Ensure camera is initialized before capturing
    if (!streamActive) {
      try {
        // Clear previous errors
        setCameraError("");

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        // If we have a webcam reference, set the stream
        if (webcamRef.current && webcamRef.current.video) {
          webcamRef.current.video.srcObject = stream;
        }

        setCameraAvailable(true);
        setStreamActive(true);

        // Wait a moment for camera to initialize before capturing
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        console.error("Error initializing camera:", err);
        setCameraError(
          "Could not access camera. Please check permissions or try uploading an image instead."
        );
        setCameraAvailable(false);
        return;
      }
    }

    setIsProcessing(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        const result = await Tesseract.recognize(imageSrc, "eng", {
          logger: (m) => console.log(m),
        });

        const text = result.data.text;
        setOcrResult(text);

        if (text) {
          // Extract barcode from text if needed
          const barcodeMatch = text.match(/\d+/); // Simple regex to find first number sequence
          if (barcodeMatch) {
            console.log("Detected barcode:", barcodeMatch[0]);
          }
        }
      } catch (error) {
        console.error("OCR failed:", error);
        setOcrResult("Error processing image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
      setOcrResult("No image captured. Please try again or upload an image.");
    }
  };

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      {cameraError ? (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {cameraError}
            {browserSupported && (
              <Button
                onClick={capture}
                variant="outlined"
                size="small"
                sx={{ ml: 2, color: "white" }}
              >
                Retry
              </Button>
            )}
          </Alert>
          {/* Hidden file input for file upload alternative */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </>
      ) : (
        <>
          {/* Show placeholder when camera is not available */}
          {(!isCameraAvailable || !browserSupported) && (
            <Box
              sx={{
                height: 250,
                backgroundColor: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {cameraError ||
                  (browserSupported
                    ? "Camera not available"
                    : "Camera not supported")}
              </Typography>

              <Button
                variant="contained"
                startIcon={<FileUpload />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image Instead
              </Button>
            </Box>
          )}
        </>
      )}

      <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
        <IconButton
          color="primary"
          onClick={capture}
          disabled={isProcessing}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "50%",
            width: 60,
            height: 60,
          }}
        >
          {isProcessing ? (
            <CircularProgress size={30} />
          ) : browserSupported ? (
            <CameraAlt fontSize="large" color="primary" />
          ) : (
            <FileUpload fontSize="large" color="primary" />
          )}
        </IconButton>
      </Stack>

   

      {ocrResult && (
        <Box sx={{ marginTop: 2, width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            OCR Result:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              maxHeight: 100,
              overflowY: "auto",
            }}
          >
            {ocrResult}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OCRCamera;
