import React, { useState } from "react";
import { QrCode, Copy, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QRCodeGeneratorProps {
  accountId?: string;
  accountName?: string;
  requestedAmount?: number;
  onQRGenerated?: (qrData: string) => void;
}

const QRCodeGenerator = ({
  accountId = "dual-1234-5678-9012",
  accountName = "John Doe",
  requestedAmount = 0,
  onQRGenerated = () => {},
}: QRCodeGeneratorProps) => {
  const [amount, setAmount] = useState<number>(requestedAmount);
  const [note, setNote] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [qrSize, setQrSize] = useState<string>("medium");

  // Mock QR code image URL - in a real app, this would be generated based on the data
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      accountId,
      accountName,
      amount,
      currency,
      note,
      timestamp: new Date().toISOString(),
    }),
  )}`;

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  // Handle note change
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  // Handle QR size change
  const handleSizeChange = (value: string) => {
    setQrSize(value);
  };

  // Mock functions for button actions
  const handleCopyToClipboard = () => {
    // In a real app, this would copy the payment details to clipboard
    alert("Payment details copied to clipboard");
  };

  const handleDownload = () => {
    // In a real app, this would download the QR code as an image
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `dual-payment-request-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator
        .share({
          title: "DUAL Payment Request",
          text: `Payment request for ${amount} ${currency}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Web Share API not supported in your browser");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <span>Generate Payment QR Code</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <motion.div
          className="flex justify-center p-4 bg-white rounded-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={qrImageUrl}
            alt="Payment QR Code"
            className={`
              ${qrSize === "small" ? "w-32 h-32" : ""}
              ${qrSize === "medium" ? "w-48 h-48" : ""}
              ${qrSize === "large" ? "w-64 h-64" : ""}
            `}
          />
        </motion.div>

        {/* Account Information */}
        <div className="bg-muted p-3 rounded-md text-sm">
          <p className="font-medium">
            Account ID: <span className="font-normal">{accountId}</span>
          </p>
          <p className="font-medium">
            Account Name: <span className="font-normal">{accountName}</span>
          </p>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Requested Amount</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              value={amount || ""}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="flex-1"
            />
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Note Input */}
        <div className="space-y-2">
          <Label htmlFor="note">Note (Optional)</Label>
          <Input
            id="note"
            value={note}
            onChange={handleNoteChange}
            placeholder="Add a note for this payment"
          />
        </div>

        {/* QR Size Selection */}
        <div className="space-y-2">
          <Label htmlFor="qr-size">QR Code Size</Label>
          <Select value={qrSize} onValueChange={handleSizeChange}>
            <SelectTrigger id="qr-size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="default" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeGenerator;
