import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';

const QRCodeScanner = ({ onScanSuccess, onCancel }) => {
    const scannerRef = useRef(null);
    const [scannedData, setScannedData] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const html5QrCode = scannerRef.current;

        if (isScanning) {
            const qrCodeScanner = new Html5Qrcode('qr-reader');
            scannerRef.current = qrCodeScanner;

            qrCodeScanner
                .start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    (decodedText) => {
                        qrCodeScanner
                            .stop()
                            .then(() => {
                                console.log('Scanner stopped successfully');
                                setScannedData(decodedText);
                                setIsScanning(false);
                                onScanSuccess(decodedText);
                            })
                            .catch((err) => {
                                console.error('Error stopping scanner:', err);
                            });
                    },
                    (errorMessage) => {
                        // Ignore scan frame errors
                    }
                )
                .catch((err) => {
                    console.error('Failed to start scanning:', err);
                    setIsScanning(false);
                });
        }

        return () => {
            // Cleanup scanner if component unmounts or scanning stops
            if (html5QrCode) {
                html5QrCode.clear();
                // html5QrCode.stop().catch(() => {});
            }
        };
    }, [isScanning]);

    const startScan = () => {
        setScannedData(null);
        setIsScanning(true);
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 rounded-xl shadow bg-white space-y-4">
            <div id="qr-reader" className="w-full aspect-square bg-gray-200 rounded-md" />

            {scannedData && (
                <div className="text-sm text-blue-700 break-words p-2 bg-gray-100 rounded">
                    <strong>Scanned:</strong> {scannedData}
                </div>
            )}

            <div className="flex justify-between">
                <Button variant="outline" onClick={onCancel}>
                    Close
                </Button>
                <Button onClick={startScan} disabled={isScanning}>
                    {isScanning ? 'Scanning...' : 'Start Scanning'}
                </Button>
            </div>
        </div>
    );
};

export default QRCodeScanner;
