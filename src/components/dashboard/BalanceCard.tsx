import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Send, Loader2, QrCode } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import QRCodeScanner from "../transactions/QRCodeScanner";
import { set } from "date-fns";

const BalanceCard = ({ balance = 0, currency = "CBDC" }) => {
  const [currentBalance, setCurrentBalance] = useState(balance);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSendModalOpen, setSendModalOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState(null);

  useEffect(() => {
    setCurrentBalance(balance);
  }, [balance]);

  function handleDataFromQR(data) {
    // Handle the data from the QR code
    console.log("QR Code data:", data);
    // You can parse the data and perform actions based on it
    setQRData(data);
  }


  return (
    <>
    <h2>{qrData}</h2>
      <Card className="w-full sm:w-[380px] h-auto sm:h-[220px] bg-card overflow-hidden">
        <CardHeader className="pb-2 p-3 sm:p-6">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Total Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <motion.div
            className="text-2xl sm:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            key={currentBalance}
          >
            {currentBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-wrap sm:flex-nowrap justify-between gap-2 p-3 sm:p-6">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => setSendModalOpen(true)}
          >
            <Send className="mr-1" size={16} />
            Send
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs sm:text-sm"
            onClick={() => setQRModalOpen(true)}
          >
            <QrCode className="mr-1" size={16} />
            Scan QR
          </Button>
        </CardFooter>
      </Card>

      {/* QR Code Scanner Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setQRModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <QRCodeScanner onScanSuccess={handleDataFromQR} onCancel={()=> setQRModalOpen(false)}/>
          <DialogFooter>
            {/* <Button variant="outline" onClick={() => setQRModalOpen(false)}>
              Close
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BalanceCard;
