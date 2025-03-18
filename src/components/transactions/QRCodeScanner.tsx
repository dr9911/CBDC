import React, { useState, useRef, useEffect } from "react";
import { Camera, X, Check, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QRCodeScannerProps {
  onScanSuccess?: (data: string) => void;
  onScanError?: (error: string) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

const QRCodeScanner = ({
  onScanSuccess = (data) => console.log("QR Code scanned:", data),
  onScanError = (error) => console.error("QR Code scan error:", error),
  onCancel = () => console.log("Scan cancelled"),
  isOpen = true,
}: QRCodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock function to simulate QR code detection
  // In a real implementation, you would use a library like jsQR
  const mockScanQRCode = () => {
    // Simulate processing time
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo

      if (success) {
        const mockData = `CBDC:recipient:${Math.random().toString(36).substring(2, 10)}`;
        onScanSuccess(mockData);
        setIsScanning(false);
      } else {
        setError("Could not detect a valid QR code. Please try again.");
        setIsScanning(false);
      }
    }, 2000);
  };

  const startCamera = async () => {
    setError(null);
    setIsScanning(true);

    try {
      // In a real implementation, you would request camera access
      // const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      // if (videoRef.current) {
      //   videoRef.current.srcObject = stream;
      // }
      setHasPermission(true);

      // Start mock scanning
      mockScanQRCode();
    } catch (err) {
      setHasPermission(false);
      setError(
        "Camera access denied. Please grant permission to use your camera.",
      );
      setIsScanning(false);
      onScanError("Camera permission denied");
    }
  };

  const stopCamera = () => {
    setIsScanning(false);
    // In a real implementation, you would stop the camera stream
    // if (videoRef.current && videoRef.current.srcObject) {
    //   const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //   tracks.forEach(track => track.stop());
    //   videoRef.current.srcObject = null;
    // }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  const retryScanning = () => {
    setError(null);
    startCamera();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-md mx-auto bg-background border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Scan QR Code</CardTitle>
        <CardDescription>
          Position the QR code within the frame to scan recipient details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative aspect-square w-full max-w-[400px] mx-auto bg-muted rounded-lg overflow-hidden">
          {/* Video element for camera feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />

          {/* Canvas for QR processing (hidden) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className="w-64 h-64 border-2 border-primary rounded-lg"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="mt-4 text-primary font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Scanning...
              </motion.div>
            </div>
          )}

          {/* Placeholder when camera is not active */}
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Camera size={64} className="text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground">
                Camera is not active. Click "Start Scanning" to begin.
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <AlertCircle size={64} className="text-destructive mb-4" />
              <p className="text-center text-destructive font-medium">
                {error}
              </p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>

        {error ? (
          <Button onClick={retryScanning}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        ) : (
          <Button
            onClick={isScanning ? stopCamera : startCamera}
            disabled={hasPermission === false}
          >
            {isScanning ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Stop Scanning
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanning
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QRCodeScanner;
