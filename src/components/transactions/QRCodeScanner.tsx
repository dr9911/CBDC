import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";

const QRCodeScanner = ({ onScanSuccess, onCancel }) => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    setScanner(codeReader);

    return () => {
      if (scanner) {
        scanner.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error("No camera found");
      }

      await scanner.decodeFromVideoDevice(
        videoInputDevices[0].deviceId, // Use first available camera
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log("QR Code detected:", result.getText());
            onScanSuccess(result.getText());
            stopScanning();
          }
          if (error) console.error("Scanning error:", error);
        }
      );
    } catch (err) {
      setError(`Camera error: ${err.message}`);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.reset();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <video ref={videoRef} className="w-full h-64" autoPlay playsInline muted />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between mt-4">
        <Button onClick={onCancel}>Close</Button>
        <Button onClick={startScanning}>Start Scanning</Button>
      </div>
    </div>
  );
};

export default QRCodeScanner;
