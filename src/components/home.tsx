import React, { useEffect, useState } from "react";
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
import usersData from "@/data/users.json";
import transactions from "@/data/transactions.json";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  sessionTimeRemaining?: number;
  notificationCount?: number;
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
  const [usersData, setUsersData] = useState(() => {
    const savedUsersData = localStorage.getItem("users");
    return savedUsersData ? JSON.parse(savedUsersData) : [];
  });
  const user = usersData.find((user) => user.username === currentUser?.username);

  // Update localStorage whenever usersData changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(usersData));
  }, [usersData]); // This will run whenever usersData changes
  console.log('Transactions:', transactions);
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]); // This will run whenever transactions changes

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
                balance={user.balance}
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
            {/* {userRole === "commercial_bank" ? 
              <CommercialBankOverview />
            } */}
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TransactionList

              onViewTransaction={handleViewTransaction}
              maxRows={2}
            />
          </motion.div>
        </motion.div>

        {/* Transaction Form Section - Hidden by default, would be shown based on state in a real app */}
        <div className="hidden">
          <TransactionForm onSubmit={handleTransactionSubmit} />
        </div>

        {/* QR Code Scanner - Hidden by default, would be shown based on state in a real app */}
        {/* <div className="hidden">
          <QRCodeScanner />
        </div> */}

        {/* QR Code Generator - Hidden by default, would be shown based on state in a real app */}
        <div className="hidden">
          <QRCodeGenerator

            accountName={effectiveUserName}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
