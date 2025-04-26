import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader'; // ✅ Correct import
import { Button } from '@/components/ui/button';

const QRCodeScannerComponent = ({ onScanSuccess, onCancel }) => {
    const [scannedData, setScannedData] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (data) => {
        if (data) {
            console.log('Scanned Data:', data);
            setScannedData(data?.text || data); // react-qr-reader v3 returns {text: "..."}
            onScanSuccess(data?.text || data);
            setScanning(false);
        }
    };

    const handleError = (err) => {
        console.error('QR Code Scan Error:', err);
        setError('Error scanning QR code: ' + err);
    };

    const startScanning = () => {
        setScanning(true);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {scanning && (
                <QrReader
                    constraints={{ facingMode: 'environment' }}
                    onResult={(result, error) => {
                        if (!!result) {
                            handleScan(result);
                        }
                        if (!!error) {
                            handleError(error);
                        }
                    }}
                    
                />
            )}

            {error && <p className="text-red-500">{error}</p>}

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

export default QRCodeScannerComponent;
