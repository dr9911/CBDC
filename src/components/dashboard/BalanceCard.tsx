import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Plus, Send, QrCode } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BalanceCardProps {
  balance?: number;
  currency?: string;
  percentChange?: number;
  spendingLimit?: number;
  currentSpending?: number;
}

const BalanceCard = ({
  balance = 25750.84,
  currency = "DUAL",

}: BalanceCardProps) => {
  // Calculate percentage of spending limit used
  // const spendingPercentage = (currentSpending / spendingLimit) * 100;

  // Determine if the percentage change is positive or negative

  return (
    <Card className="w-[380px] h-[220px] bg-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Total Balance</span>

        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {currency}{" "}
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </motion.div>

        {/* <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spending Limit</span>
            <span>{Math.round(spendingPercentage)}% used</span>
          </div>
          <Progress value={spendingPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {currency} {currentSpending.toLocaleString()}
            </span>
            <span>
              {currency} {spendingLimit.toLocaleString()}
            </span>
          </div>
        </div> */}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Plus className="mr-1" size={16} />
          Add Funds
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Send className="mr-1" size={16} />
          Send
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <QrCode className="mr-1" size={16} />
          Receive
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
