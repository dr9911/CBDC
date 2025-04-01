import React, { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QrScanner from "qr-scanner";

const QRCodeScanner = ({ onScanSuccess, onCancel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState("environment"); // Default to back camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      // Initialize the QR scanner using the current approach
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR Code detected:", result.data);
          onScanSuccess(result.data);
          stopCamera(); // Stop scanning once QR code is detected
        },
        {
          onDecodeError: (error) => {
            console.error("Scanning error:", error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: facingMode,
          returnDetailedScanResult: true,
          maxScansPerSecond:10
          
          
        }
      );

      scannerRef.current.start().catch((error) => {
        console.error("Failed to start scanner:", error);
        setError(`Failed to start scanner: ${error.message || "Unknown error"}`);
        stopCamera();
        // onScanError?.("Scanner initialization failed");
      });

      return () => {
        if (scannerRef.current) {
          scannerRef.current.stop();
          scannerRef.current.destroy();
          scannerRef.current = null;
        }
      };
    }
  }, [isCameraActive, facingMode, onScanSuccess]);

  const startCamera = async () => {
    setError(null);
    setIsScanning(true);
    setIsCameraActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 }, facingMode: facingMode },
      });
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      handleCameraError(err);
    }
  };

  const handleCameraError = (err) => {
    setHasPermission(false);
    if (err.name === "NotAllowedError") {
      setError("Camera access denied. Please allow camera access.");
    } else if (err.name === "NotFoundError") {
      setError("No camera found on this device.");
    } else if (err.name === "NotReadableError") {
      setError("Camera is already in use by another application.");
    } else {
      setError(`Camera error: ${err.message || "Unknown error"}`);
    }
    setIsScanning(false);
    setIsCameraActive(false);
    // onScanError?.(err.message || "Camera access error");
  };

  const stopCamera = () => {
    setIsScanning(false);
    setIsCameraActive(false);

    if (scannerRef.current) {
      scannerRef.current.stop();
    }
  };

  const toggleCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    
    setFacingMode(facingMode === "environment" ? "user" : "environment");
  };

  const handleClose = () => {
    stopCamera();
    onCancel?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        {!isCameraActive ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Camera size={64} className="text-muted-foreground mb-4" />
            <p>Click "Start Scanning" to activate the camera.</p>
          </div>
        ) : (
          <div className="relative w-full h-64">
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover rounded-md" 
              autoPlay 
              playsInline 
              muted 
            />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500"></div>
                </div>
              </div>
            )}
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClose}>
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
        <div className="flex gap-2">
          {isCameraActive && (
            <Button variant="outline" onClick={toggleCamera}>
              <Camera className="mr-2 h-4 w-4" />
              {facingMode === "environment" ? "Front Camera" : "Back Camera"}
            </Button>
          )}
          {isCameraActive ? (
            <Button onClick={stopCamera}>
              <X className="mr-2 h-4 w-4" />
              Stop Scanning
            </Button>
          ) : (
            <Button onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;