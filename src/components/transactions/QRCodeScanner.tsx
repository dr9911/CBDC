import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';

const QRCodeScanner = ({ onScanSuccess, onCancel }) => {
    const webcamRef = useRef(null);
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scannedData, setScannedData] = useState(null); // To store and display scanned data

    useEffect(() => {
        if (scanning) {
            const interval = setInterval(() => {
                scanQRCode();
            }, 100); // Capture and scan every 100ms

            return () => clearInterval(interval);
        }
    }, [scanning]);

    const scanQRCode = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                // Scan for QR Code using jsQR
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    // When QR code is found, stop scanning and trigger the success callback
                    setScanning(false);
                    setScannedData(code.data); // Set the scanned QR code data (URL or text)
                    onScanSuccess(code.data); // Pass QR code data to the onScanSuccess callback
                }
            };
        }
    };

    const startScanning = () => {
        setScanning(true);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{ facingMode: 'environment' }}
                onUserMediaError={(error) => setError('Unable to access webcam')}
                audio={false}
            />
            {error && <p className="text-red-500">{error}</p>}

            {/* Display scanned data here */}
            {scannedData && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">Scanned Data:</h3>
                    <p className="text-blue-500">{scannedData}</p>
                </div>
            )}

            <div className="flex justify-between mt-4">
                <Button onClick={onCancel}>Close</Button>
                <Button onClick={startScanning} disabled={scanning}>
                    {scanning ? 'Scanning...' : 'Start Scanning'}
                </Button>
            </div>
        </div>
    );
};

export default QRCodeScanner;
