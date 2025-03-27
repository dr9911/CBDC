import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  DollarSign,
  Building,
  Users,
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

interface CommercialBankOverviewProps {
  bankName?: string;
  accountNumber?: string;
  balance?: number;
  currency?: string;
  clientCount?: number;
  transactionVolume?: number;
}

const CommercialBankOverview = ({
  bankName = "First Commercial Bank",
  accountNumber = "CBDC-COMM-5678-9012",
  balance = 10750000.85,
  currency = "$",
  clientCount = 1250,
  transactionVolume = 8750000,
}: CommercialBankOverviewProps) => {
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
              Commercial Bank Dashboard
            </CardTitle>
            <CardDescription className="text-sm">
              {bankName} • {accountNumber}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <Building className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Commercial Bank Portal
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    Monthly Volume: {formatCurrency(transactionVolume)}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Client Information
                </h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-xl sm:text-2xl font-bold">{clientCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    {Math.floor(clientCount * 0.65)}
                  </p>
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

export default CommercialBankOverview;
