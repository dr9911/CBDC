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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import QRCodeScanner from "../transactions/QRCodeScanner";

// --- User & Transaction Interfaces ---
interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  type: "user_to_user" | "bank_to_user" | "user_to_bank" | "mint";
}

interface User {
  id: string;
  username: string;
  balance: number;
  role: string;
}

interface BalanceCardProps {
  balance?: number;
  currency?: string;
}

const BalanceCard = ({
  balance: initialBalance = 0,
  currency = "CBDC",
}: BalanceCardProps) => {
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // --- Modal States ---
  const [isSendModalOpen, setSendModalOpen] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [qrData, setQRData] = useState(null);

  // --- Form States ---
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Sync balance if prop changes
  useEffect(() => {
    setCurrentBalance(initialBalance);
  }, [initialBalance]);

  // Reset form state when modal is closed
  useEffect(() => {
    setRecipient("");
    setAmount("");
    setRecipientError("");
    setAmountError("");
    setGeneralError("");
    setIsSending(false);
  }, [isSendModalOpen]);

  // Handle QR Code Data
  function handleDataFromQR(data: string) {
    console.log("QR Code data:", data);
    addToBalance(data);
    // setQRData(data);
    // setRecipient(data); // Autofill recipient with scanned username
    setQRModalOpen(false);
    // setSendModalOpen(true); // Open send modal with scanned data
  }
  function addToBalance(data: string) {
    const valueToAdd = 20; // Hardcoded value for demonstration
    const parsedData = parseFloat(data);
    setCurrentBalance(prevBalance => prevBalance + valueToAdd);

  }
  // --- Handle Send Token ---
  const handleSend = async () => {
    setIsSending(true);
    setRecipientError("");
    setAmountError("");
    setGeneralError("");

    try {
      const parsedAmount = parseFloat(String(amount));

      if (!recipient) {
        setRecipientError("Recipient username is required.");
        throw new Error("Validation failed");
      }
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setAmountError("Please enter a valid positive amount.");
        throw new Error("Validation failed");
      }

      let usersData: User[] = [];
      let transactionsData: Transaction[] = [];

      try {
        const storedUsers = localStorage.getItem("users");
        usersData = storedUsers ? JSON.parse(storedUsers) : [];
        if (!Array.isArray(usersData)) usersData = [];

        const storedTransactions = localStorage.getItem("transactions");
        transactionsData = storedTransactions ? JSON.parse(storedTransactions) : [];
        if (!Array.isArray(transactionsData)) transactionsData = [];
      } catch (error) {
        console.error("Failed to parse data from localStorage:", error);
        setGeneralError("Error reading data. Please try again later.");
        throw error;
      }

      const senderIndex = usersData.findIndex(user => user.id === currentUser?.id);
      const receiverIndex = usersData.findIndex(user => user.username === recipient);

      if (senderIndex === -1) {
        setGeneralError("Your user data could not be found. Please re-login.");
        throw new Error("Sender not found");
      }
      if (receiverIndex === -1) {
        setRecipientError("Recipient username not found.");
        throw new Error("Recipient not found");
      }

      const sender = usersData[senderIndex];
      const receiver = usersData[receiverIndex];

      if (sender.id === receiver.id) {
        setRecipientError("You cannot send funds to yourself.");
        throw new Error("Self-send attempt");
      }
      if (sender.balance < parsedAmount) {
        setAmountError("Insufficient funds.");
        throw new Error("Insufficient funds");
      }

      usersData[senderIndex].balance -= parsedAmount;
      usersData[receiverIndex].balance += parsedAmount;

      const newTransaction: Transaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: sender.id,
        receiver: receiver.id,
        amount: parsedAmount,
        timestamp: new Date().toISOString(),
        status: "completed",
        type: "user_to_user",
      };
      transactionsData.push(newTransaction);

      localStorage.setItem("users", JSON.stringify(usersData));
      localStorage.setItem("transactions", JSON.stringify(transactionsData));

      setCurrentBalance(usersData[senderIndex].balance);

      toast({
        title: "Transaction Successful",
        description: `Sent ${parsedAmount.toFixed(2)} to ${receiver.username}.`,
      });

      setSendModalOpen(false);
    } catch (error: any) {
      console.error("Send transaction failed:", error);
      if (!recipientError && !amountError && !generalError) {
        setGeneralError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Card className="w-full sm:w-[380px] h-auto sm:h-[220px] bg-card overflow-hidden">
        <CardHeader className="pb-2 p-3 sm:p-6">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Total Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <motion.div className="text-2xl sm:text-3xl font-bold mb-4">
            {currentBalance.toFixed(2)}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 p-3 sm:p-6">
          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setSendModalOpen(true)}>
            <Send className="mr-1" size={16} /> Send
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setQRModalOpen(true)}>
            <QrCode className="mr-1" size={16} /> Scan QR
          </Button>
        </CardFooter>
      </Card>

      {/* Send Token Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {currency}</DialogTitle>
          </DialogHeader>
          <Input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient username" />
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
          <DialogFooter>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? <Loader2 className="mr-2 animate-spin" /> : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Scanner Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setQRModalOpen}>
        <DialogContent>
          <QRCodeScanner onScanSuccess={handleDataFromQR} onCancel={()=> setQRModalOpen(false)}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BalanceCard;
