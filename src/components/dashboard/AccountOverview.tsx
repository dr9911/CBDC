import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AccountOverviewProps {
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  currency?: string;
  spendingLimit?: number;
  spendingUsed?: number;
  transactions?: {
    incoming: number;
    outgoing: number;
  };
}

const AccountOverview = ({
  accountNumber = "DUAL-1234-5678-9012",
  accountType = "Digital Currency Account",
  balance = 25750.85,
  currency = "$",
  spendingLimit = 30000,
  spendingUsed = 18500,
  transactions = {
    incoming: 12500,
    outgoing: 8750,
  },
}: AccountOverviewProps) => {
  // Calculate spending percentage
  const spendingPercentage = Math.min(
    100,
    Math.round((spendingUsed / spendingLimit) * 100),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1200px] bg-background"
    >
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 p-4 sm:p-6">
          <div>
            <CardTitle className="text-xl font-bold">
              Account Overview
            </CardTitle>
            <CardDescription className="text-sm">
              {accountType} • {accountNumber}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Secure Account
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Balance Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </h3>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end">
                <span className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(balance)}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">
                    {formatCurrency(transactions.incoming)}
                  </span>
                </div>
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">
                    {formatCurrency(transactions.outgoing)}
                  </span>
                </div>
              </div>
            </div>

            {/* Spending Limit Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Spending Limit
                </h3>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end">
                <span className="text-2xl sm:text-3xl font-bold">
                  {formatCurrency(spendingLimit)}
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Used: {formatCurrency(spendingUsed)}</span>
                  <span
                    className={
                      spendingPercentage > 80
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }
                  >
                    {spendingPercentage}%
                  </span>
                </div>
                <Progress
                  value={spendingPercentage}
                  className={`h-2 ${spendingPercentage > 80 ? "bg-red-200" : ""}`}
                />
              </div>
            </div>

            {/* Account Details Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">{accountType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-500">Active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">Jan 15, 2023</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="font-medium">Today, 10:45 AM</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between w-full text-xs sm:text-sm gap-2">
            <span className="text-muted-foreground">
              Last updated: Today at 11:30 AM
            </span>
            <button className="text-primary hover:underline">
              View detailed report
            </button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AccountOverview;
