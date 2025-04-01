import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Plus, Send, QrCode, Loader2 } from "lucide-react";
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
// Import useToast hook
import { useToast } from "@/components/ui/use-toast";

// Define the transaction structure (optional but good for clarity)
interface Transaction {
  id: string;
  sender: string; // Should be user/bank ID
  receiver: string; // Should be user/bank ID
  amount: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  type: "user_to_user" | "bank_to_user" | "user_to_bank" | "mint"; // Add more types as needed
}

// Define the structure of your user object from localStorage
interface User {
  id: string;
  username: string;
  balance: number;
  role: string;
  // Add other fields if necessary
}

interface BalanceCardProps {
  balance?: number;
  currency?: string;
}

const BalanceCard = ({
  balance: initialBalance = 0, // Default to 0 if not provided
  currency = "CBDC",
}: BalanceCardProps) => {
  const [currentBalance, setCurrentBalance] = useState(initialBalance);
  const { currentUser } = useAuth(); // Assuming currentUser contains at least { id: string, username: string }
  const { toast } = useToast(); // Initialize the toast hook

  // Modal State
  const [isSendModalOpen, setSendModalOpen] = useState(false);

  // Form State
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Loading State
  const [isSending, setIsSending] = useState(false);

  // Sync balance if prop changes
  useEffect(() => {
      setCurrentBalance(initialBalance);
  }, [initialBalance]);

  // Reset form state when modal is closed or opened
  useEffect(() => {
    setRecipient("");
    setAmount("");
    setRecipientError("");
    setAmountError("");
    setGeneralError("");
    setIsSending(false); // Reset loading state if modal is re-opened or closed
  }, [isSendModalOpen]);


  const handleSend = async () => { // Make async if simulating delay
    // 0. Start Loading & Clear previous errors
    setIsSending(true);
    setRecipientError("");
    setAmountError("");
    setGeneralError("");

    // Add a small artificial delay to see the loader (optional)
    // await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // --- 1. Validation ---
        const parsedAmount = parseFloat(String(amount));

        if (!recipient) {
            setRecipientError("Recipient username is required.");
            throw new Error("Validation failed"); // Throw to exit try block early
        }
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setAmountError("Please enter a valid positive amount.");
             throw new Error("Validation failed");
        }

        // --- Get Data ---
        let usersData: User[] = [];
        let transactionsData: Transaction[] = [];

        try {
            const storedUsers = localStorage.getItem("users");
            usersData = storedUsers ? JSON.parse(storedUsers) : [];
            if (!Array.isArray(usersData)) usersData = []; // Basic check

            const storedTransactions = localStorage.getItem("transactions"); // Use specific key
             transactionsData = storedTransactions ? JSON.parse(storedTransactions) : [];
             if (!Array.isArray(transactionsData)) transactionsData = []; // Basic check

        } catch (error) {
            console.error("Failed to parse data from localStorage:", error);
            setGeneralError("Error reading data. Please try again later.");
            throw error; // Re-throw to be caught by outer catch
        }

        // --- Find Sender/Receiver ---
        const senderIndex = usersData.findIndex(user => user.id === currentUser?.id); // Add safe navigation
        const receiverIndex = usersData.findIndex(user => user.username === recipient);

        if (senderIndex === -1) {
            console.error("Sender not found in localStorage.");
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

        // --- 2. Prepare Updates ---
        // Modify balances
        usersData[senderIndex].balance -= parsedAmount;
        usersData[receiverIndex].balance += parsedAmount;

        // Create Transaction Log Entry
        const newTransaction: Transaction = {
             id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Simple unique enough ID for POC
             sender: sender.id,
             receiver: receiver.id,
             amount: parsedAmount,
             timestamp: new Date().toISOString(),
             status: "completed",
             type: "user_to_user"
        };
        transactionsData.push(newTransaction);


        // --- 3. Persist changes ---
        localStorage.setItem('users', JSON.stringify(usersData));
        localStorage.setItem('transactions', JSON.stringify(transactionsData));

        // --- 4. Update UI State & Show Success ---
        setCurrentBalance(usersData[senderIndex].balance); // Update displayed balance

        toast({ // Show success toast
          title: "Transaction Successful",
          description: `Sent ${parsedAmount.toLocaleString(undefined, {               minimumFractionDigits: 2,
            maximumFractionDigits: 2, })} to ${receiver.username}.`,
          variant: "default", // or "success" if you've configured variants
        });

        setSendModalOpen(false); // Close the modal on success

    } catch (error: any) {
        console.error("Send transaction failed:", error);
        // Don't set generalError if a specific field error was already set
        if (!recipientError && !amountError && !generalError) {
             // Only set general error if no specific error was shown and it's not a validation error we explicitly threw
             if (error.message !== "Validation failed" && error.message !== "Recipient not found" && error.message !== "Insufficient funds" && error.message !== "Self-send attempt" && error.message !== "Sender not found") {
                 setGeneralError(`An unexpected error occurred: ${error.message}`);
             }
        }
        // NOTE: No balance rollback needed here as we only save to localStorage on full success within the try block.
    } finally {
        // --- 5. Stop Loading ---
        setIsSending(false);
    }
  };


  // Render part remains largely the same, except for the Send button in the DialogFooter
  return (
    <>
      <Card className="w-full sm:w-[380px] h-auto sm:h-[220px] bg-card overflow-hidden">
         {/* CardHeader and CardContent... */}
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
            key={currentBalance} // Helps re-animate if balance changes
          >
            {/* Display Currency Symbol properly if needed */}
            {currentBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </motion.div>
        </CardContent>
         <CardFooter className="flex flex-wrap sm:flex-nowrap justify-between gap-2 p-3 sm:p-6">

           {/* Send Button */}
           <Button
             variant="outline"
             size="sm"
             className="flex-1 text-xs sm:text-sm"
             onClick={() => setSendModalOpen(true)}
           >
             <Send className="mr-1" size={16} />
             Send
           </Button>
         </CardFooter>
       </Card>

      {/* Send Token Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send {currency}</DialogTitle> {/* Use dynamic currency */}
            <DialogDescription>
              Enter the recipient's username and the amount to send.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             {/* General Error Display */}
             {generalError && (
                 <p className="text-sm font-medium text-destructive">{generalError}</p>
             )}
              {/* Recipient Input & Error */}
             <div className="space-y-1">
               <label htmlFor="recipient" className="text-sm font-medium">Recipient Username</label>
               <Input
                 id="recipient"
                 placeholder="e.g., user2"
                 value={recipient}
                 onChange={(e) => {
                     setRecipient(e.target.value);
                     if(recipientError) setRecipientError("");
                     if(generalError) setGeneralError("");
                 }}
                 aria-invalid={!!recipientError}
                 aria-describedby="recipient-error"
                 className={recipientError ? "border-destructive focus-visible:ring-destructive" : ""}
                 disabled={isSending} // Disable input while sending
               />
               {recipientError && <p id="recipient-error" className="text-sm font-medium text-destructive">{recipientError}</p>}
             </div>
              {/* Amount Input & Error */}
             <div className="space-y-1">
                <label htmlFor="amount" className="text-sm font-medium">Amount ({currency})</label>
               <Input
                 id="amount"
                 placeholder="e.g., 50.00"
                 type="number"
                 step="0.01"
                 min="0.01"
                 value={amount}
                 onChange={(e) => {
                     setAmount(e.target.value);
                     if (amountError) setAmountError("");
                     if(generalError) setGeneralError("");
                 }}
                  aria-invalid={!!amountError}
                 aria-describedby="amount-error"
                 className={amountError ? "border-destructive focus-visible:ring-destructive" : ""}
                 disabled={isSending} // Disable input while sending
               />
               {amountError && <p id="amount-error" className="text-sm font-medium text-destructive">{amountError}</p>}
             </div>
           </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendModalOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            {/* Updated Send Button with Loading State */}
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
              ) : (
                "Send"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BalanceCard;