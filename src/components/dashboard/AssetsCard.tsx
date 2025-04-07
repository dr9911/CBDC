import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface AssetsCardProps {
  stocks?: number;
  bonds?: number;
  securities?: number;
}

const AssetsCard = ({
  stocks = 100000,
  bonds = 50000,
  securities = 25000,
}: AssetsCardProps) => {
  const totalAssets = stocks + bonds + securities;
  const stocksPercent = totalAssets ? stocks / totalAssets : 0;
  const bondsPercent = totalAssets ? bonds / totalAssets : 0;
  const securitiesPercent = totalAssets ? securities / totalAssets : 0;

  return (
    <Card className="w-full sm:w-[380px] h-auto sm:h-[220px] bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl">
      <CardHeader className="pb-2 p-4 sm:p-6 bg-gray-400">
        <CardTitle className="text-lg font-semibold text-white flex justify-between items-center">
          <span>Total Assets</span>
          <BarChart2 size={20} className="text-white" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1"
        >
          ${totalAssets.toLocaleString()}
        </motion.div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300 mb-4">
          <div className="flex flex-col items-center">
            <span>Stocks</span>
            <span>${stocks.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>Bonds</span>
            <span>${bonds.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>Securities</span>
            <span>${securities.toLocaleString()}</span>
          </div>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <svg className="w-full h-full">
            <motion.rect
              initial={{ width: 0 }}
              animate={{ width: `${stocksPercent * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              height="100%"
              fill="#4F46E5"
            />
            <motion.rect
              initial={{ width: 0 }}
              animate={{ width: `${bondsPercent * 100}%` }}
              transition={{ duration: 0.8, delay: 0.4 }}
              x={`${stocksPercent * 100}%`}
              height="100%"
              fill="#22C55E"
            />
            <motion.rect
              initial={{ width: 0 }}
              animate={{ width: `${securitiesPercent * 100}%` }}
              transition={{ duration: 0.8, delay: 0.6 }}
              x={`${(stocksPercent + bondsPercent) * 100}%`}
              height="100%"
              fill="#F97316"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetsCard;
