import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Building,
  Clock,
  FileText,
  Download,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Info,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserMintingViewProps {
  totalSupply?: number;
  circulatingSupply?: number;
  mintingEvents?: MintingEvent[];
  mintingDistribution?: {
    entity: string;
    percentage: number;
    amount: number;
  }[];
  mintingTrends?: {
    month: string;
    amount: number;
    change: number;
  }[];
}

interface MintingEvent {
  id: string;
  amount: number;
  operationType: "mint" | "burn";
  status: "completed" | "processing";
  date: string;
  entity: string;
  entityType: "central_bank" | "commercial_bank" | "government";
  purpose: string;
  transactionHash: string;
}

const UserMintingView = ({
  totalSupply = 10000000,
  circulatingSupply = 7500000,
  mintingEvents = [
    {
      id: "mint-001",
      amount: 500000,
      operationType: "mint",
      status: "completed",
      date: "2023-06-10T11:05:00",
      entity: "Central Bank",
      entityType: "central_bank",
      purpose: "Quarterly allocation to commercial banks",
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j",
    },
    {
      id: "mint-002",
      amount: 250000,
      operationType: "mint",
      status: "completed",
      date: "2023-06-05T09:30:00",
      entity: "Central Bank",
      entityType: "central_bank",
      purpose: "Government social welfare program",
      transactionHash: "0x2b3c4d5e6f7g8h9i0j1k",
    },
    {
      id: "mint-003",
      amount: 100000,
      operationType: "burn",
      status: "completed",
      date: "2023-06-01T14:15:00",
      entity: "Central Bank",
      entityType: "central_bank",
      purpose: "Monetary policy adjustment",
      transactionHash: "0x3c4d5e6f7g8h9i0j1k2l",
    },
    {
      id: "mint-004",
      amount: 75000,
      operationType: "mint",
      status: "processing",
      date: "2023-06-15T10:30:00",
      entity: "First National Bank",
      entityType: "commercial_bank",
      purpose: "Increased customer demand",
      transactionHash: "0x4d5e6f7g8h9i0j1k2l3m",
    },
  ],
  mintingDistribution = [
    {
      entity: "Commercial Banks",
      percentage: 45,
      amount: 4500000,
    },
    {
      entity: "Government",
      percentage: 30,
      amount: 3000000,
    },
    {
      entity: "Direct to Users",
      percentage: 15,
      amount: 1500000,
    },
    {
      entity: "Reserve",
      percentage: 10,
      amount: 1000000,
    },
  ],
  mintingTrends = [
    {
      month: "January",
      amount: 800000,
      change: 0,
    },
    {
      month: "February",
      amount: 750000,
      change: -6.25,
    },
    {
      month: "March",
      amount: 900000,
      change: 20,
    },
    {
      month: "April",
      amount: 850000,
      change: -5.56,
    },
    {
      month: "May",
      amount: 950000,
      change: 11.76,
    },
    {
      month: "June",
      amount: 925000,
      change: -2.63,
    },
  ],
}: UserMintingViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "events"
  );
  const [selectedEvent, setSelectedEvent] = useState<MintingEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle type filter change
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleViewEventDetails = (event: MintingEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("$", "");
  };

  // Format date
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

  // Get entity icon based on type
  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "central_bank":
        return <Landmark className="h-4 w-4 text-blue-600" />;
      case "commercial_bank":
        return <Building className="h-4 w-4 text-green-600" />;
      case "government":
        return <Building className="h-4 w-4 text-amber-600" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">CBDC Minting Transparency</h1>
          <p className="text-muted-foreground mt-1">
            Public information about CBDC minting and circulation
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Data
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink size={16} />
            Official Documentation
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total CBDC Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(totalSupply)} CBDC
              </div>
              <Banknote className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Authorized by Central Bank
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Circulating Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(circulatingSupply)} CBDC
              </div>
              <RefreshCw className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {Math.round((circulatingSupply / totalSupply) * 100)}% of
                  total supply
                </span>
              </div>
              <Progress
                value={(circulatingSupply / totalSupply) * 100}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Minting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  mintingEvents
                    .filter(
                      (event) =>
                        event.operationType === "mint" &&
                        new Date(event.date).getMonth() ===
                          new Date().getMonth()
                    )
                    .reduce((sum, event) => sum + event.amount, 0)
                )}{" "}
                CBDC
              </div>
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minted this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Burning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  mintingEvents
                    .filter(
                      (event) =>
                        event.operationType === "burn" &&
                        new Date(event.date).getMonth() ===
                          new Date().getMonth()
                    )
                    .reduce((sum, event) => sum + event.amount, 0)
                )}{" "}
                CBDC
              </div>
