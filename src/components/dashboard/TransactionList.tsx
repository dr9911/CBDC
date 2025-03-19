import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  date: string;
  type: "incoming" | "outgoing";
  amount: number;
  recipient: string;
  status: "completed" | "pending" | "failed";
  reference?: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  onViewTransaction?: (id: string) => void;
  onFilterChange?: (filter: string) => void;
  onSearch?: (query: string) => void;
  showAllTransactions?: boolean;
}

const TransactionList = ({
  transactions = [
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
  onViewTransaction = () => {},
  onFilterChange = () => {},
  onSearch = () => {},
  showAllTransactions = false,
}: TransactionListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange(value);
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    onFilterChange(value);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full bg-card">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-sm">
              {showAllTransactions
                ? "All transactions"
                : "View and manage your transaction history"}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {/* Filters and search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={toggleSortDirection}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Transactions list */}
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground">
              <div className="col-span-3 md:col-span-2">Date</div>
              <div className="col-span-3 md:col-span-2">Type</div>
              <div className="col-span-3 md:col-span-2">Amount</div>
              <div className="hidden md:block md:col-span-3">Recipient</div>
              <div className="col-span-2 md:col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No transactions found
              </div>
            ) : (
              <div className="divide-y min-w-[600px]">
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    className="grid grid-cols-12 gap-2 p-4 items-center text-xs sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <div className="col-span-3 md:col-span-2 truncate">
                      {formatDate(transaction.date)}
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      <Badge
                        variant={
                          transaction.type === "incoming"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          transaction.type === "incoming"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs"
                        }
                      >
                        {transaction.type === "incoming" ? "Received" : "Sent"}
                      </Badge>
                    </div>
                    <div className="col-span-3 md:col-span-2 font-medium">
                      <span
                        className={
                          transaction.type === "incoming"
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      >
                        {transaction.type === "incoming" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="hidden md:block md:col-span-3 truncate">
                      {transaction.recipient}
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <Badge
                        variant={getStatusBadgeVariant(transaction.status)}
                        className="text-xs"
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewTransaction(transaction.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagination placeholder */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
          <div>
            {!showAllTransactions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/history")}
              >
                View All Transactions
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
