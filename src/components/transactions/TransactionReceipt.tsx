import React from "react";
import { motion } from "framer-motion";
import { Share2, Download, Printer, Check, Copy } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface TransactionReceiptProps {
  transactionId?: string;
  date?: string;
  amount?: number;
  currency?: string;
  recipientName?: string;
  recipientAccount?: string;
  senderName?: string;
  senderAccount?: string;
  description?: string;
  status?: "completed" | "pending" | "failed";
  reference?: string;
}

const TransactionReceipt = ({
  transactionId = "TX-20230615-78945",
  date = "June 15, 2023 - 14:32:45",
  amount = 1250.0,
  currency = "CBDC",
  recipientName = "Jane Smith",
  recipientAccount = "CBDC-9876-5432-1098",
  senderName = "John Doe",
  senderAccount = "CBDC-1234-5678-9012",
  description = "Payment for consulting services",
  status = "completed",
  reference = "INV-2023-06-15",
}: TransactionReceiptProps) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    console.log("Downloading receipt as PDF");
  };

  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    console.log("Opening share dialog");
  };

  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto bg-background"
    >
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Badge
              variant={
                status === "completed"
                  ? "default"
                  : status === "pending"
                    ? "secondary"
                    : "destructive"
              }
              className="text-xs px-3 py-1"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">
            Transaction Receipt
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{date}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Transaction ID
            </span>
            <div className="flex items-center">
              <span className="font-mono text-sm mr-2">{transactionId}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={copyToClipboard}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">
                {currency}{" "}
                {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Sender</h3>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-medium">{senderName}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {senderAccount}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Recipient</h3>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="font-medium">{recipientName}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {recipientAccount}
              </p>
            </div>
          </div>

          {reference && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="text-sm font-medium">{reference}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-3">
          <Separator className="mb-2" />
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            This is an official receipt for your CBDC transaction. Please keep
            it for your records.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TransactionReceipt;
