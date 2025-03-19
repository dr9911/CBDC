import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "./layout/DashboardLayout";
import AccountOverview from "./dashboard/AccountOverview";
import CommercialBankOverview from "./dashboard/CommercialBankOverview";
import BalanceCard from "./dashboard/BalanceCard";
import TransactionList from "./dashboard/TransactionList";
import TransactionForm from "./transactions/TransactionForm";
import QRCodeScanner from "./transactions/QRCodeScanner";
import QRCodeGenerator from "./transactions/QRCodeGenerator";
import { useAuth } from "@/context/AuthContext";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  sessionTimeRemaining?: number;
  notificationCount?: number;
  accountData?: {
    accountNumber: string;
    accountType: string;
    balance: number;
    spendingLimit: number;
    spendingUsed: number;
    transactions: {
      incoming: number;
      outgoing: number;
    };
  };
  recentTransactions?: Array<{
    id: string;
    date: string;
    type: "incoming" | "outgoing";
    amount: number;
    recipient: string;
    status: "completed" | "pending" | "failed";
    reference?: string;
  }>;
}

const Home = ({
  userName,
  userAvatar,
  isAuthenticated,
  sessionTimeRemaining,
  notificationCount = 3,
  accountData = {
    accountNumber: "DUAL-1234-5678-9012",
    accountType: "Digital Currency Account",
    balance: 25750.85,
    spendingLimit: 30000,
    spendingUsed: 18500,
    transactions: {
      incoming: 12500,
      outgoing: 8750,
    },
  },
  recentTransactions = [
    {
      id: "tx-001",
      date: "2023-06-15T10:30:00",
      type: "outgoing",
      amount: 250.0,
      recipient: "Jane Smith",
      status: "completed",
      reference: "Monthly rent",
    },
    {
      id: "tx-002",
      date: "2023-06-14T14:45:00",
      type: "incoming",
      amount: 1200.0,
      recipient: "Salary deposit",
      status: "completed",
    },
    {
      id: "tx-003",
      date: "2023-06-13T09:15:00",
      type: "outgoing",
      amount: 45.5,
      recipient: "Coffee Shop",
      status: "completed",
    },
    {
      id: "tx-004",
      date: "2023-06-12T16:20:00",
      type: "outgoing",
      amount: 120.75,
      recipient: "Grocery Store",
      status: "completed",
    },
    {
      id: "tx-005",
      date: "2023-06-10T11:05:00",
      type: "incoming",
      amount: 500.0,
      recipient: "Client Payment",
      status: "completed",
    },
  ],
}: HomeProps) => {
  const { currentUser } = useAuth();
  const effectiveUserName = userName || currentUser?.name || "John Doe";
  const effectiveUserAvatar =
    userAvatar ||
    currentUser?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=John`;
  const userRole = currentUser?.role || "user";

  // Function to handle viewing transaction details
  const handleViewTransaction = (id: string) => {
    console.log(`View transaction details for ID: ${id}`);
    // In a real app, this would open a modal or navigate to transaction details
  };

  // Function to handle transaction form submission
  const handleTransactionSubmit = (values: any) => {
    console.log("Transaction submitted:", values);
    // In a real app, this would process the transaction
  };

  return (
    <DashboardLayout
      userName={effectiveUserName}
      userAvatar={effectiveUserAvatar}
      isAuthenticated={isAuthenticated}
      sessionTimeRemaining={sessionTimeRemaining}
      notificationCount={notificationCount}
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Main dashboard content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-full"
            >
              <BalanceCard
                balance={accountData.balance}
                spendingLimit={accountData.spendingLimit}
                currentSpending={accountData.spendingUsed}
              />
            </motion.div>
          </div>

          {/* Account Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            {userRole === "commercial_bank" ? (
              <CommercialBankOverview />
            ) : (
              <AccountOverview
                accountNumber={accountData.accountNumber}
                accountType={accountData.accountType}
                balance={accountData.balance}
                spendingLimit={accountData.spendingLimit}
                spendingUsed={accountData.spendingUsed}
                transactions={accountData.transactions}
              />
            )}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TransactionList
              transactions={recentTransactions}
              onViewTransaction={handleViewTransaction}
            />
          </motion.div>
        </motion.div>

        {/* Transaction Form Section - Hidden by default, would be shown based on state in a real app */}
        <div className="hidden">
          <TransactionForm onSubmit={handleTransactionSubmit} />
        </div>

        {/* QR Code Scanner - Hidden by default, would be shown based on state in a real app */}
        <div className="hidden">
          <QRCodeScanner />
        </div>

        {/* QR Code Generator - Hidden by default, would be shown based on state in a real app */}
        <div className="hidden">
          <QRCodeGenerator
            accountId={accountData.accountNumber}
            accountName={effectiveUserName}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
