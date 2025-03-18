import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  Shield,
  AlertTriangle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  Users,
  Building,
  ArrowRight,
  RefreshCw,
  FileText,
  Download,
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
import { Label } from "@/components/ui/label";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CentralBankMintingProps {
  userName?: string;
  userRole?: string;
  totalSupply?: number;
  circulatingSupply?: number;
  mintingRequests?: MintingRequest[];
  mintingHistory?: MintingOperation[];
  mintingLimits?: {
    daily: number;
    monthly: number;
    dailyUsed: number;
    monthlyUsed: number;
  };
}

interface MintingRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: "commercial_bank" | "government";
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "processing";
  dateRequested: string;
  approvalNeeded: number;
  approvalsReceived: number;
}

interface MintingOperation {
  id: string;
  amount: number;
  operationType: "mint" | "burn";
  status: "completed" | "failed" | "processing";
  date: string;
  authorizedBy: string[];
  transactionHash?: string;
  purpose: string;
}

const CentralBankMinting = ({
  userName = "Central Bank Admin",
  userRole = "Chief Monetary Officer",
  totalSupply = 10000000,
  circulatingSupply = 7500000,
  mintingLimits = {
    daily: 500000,
    monthly: 5000000,
    dailyUsed: 150000,
    monthlyUsed: 2500000,
  },
  mintingRequests = [
    {
      id: "req-001",
      requesterId: "bank-001",
      requesterName: "First National Bank",
      requesterType: "commercial_bank",
      amount: 250000,
      purpose: "Quarterly allocation",
      status: "pending",
      dateRequested: "2023-06-15T10:30:00",
      approvalNeeded: 3,
      approvalsReceived: 1,
    },
    {
      id: "req-002",
      requesterId: "bank-002",
      requesterName: "Global Trust Bank",
      requesterType: "commercial_bank",
      amount: 175000,
      purpose: "Liquidity management",
      status: "pending",
      dateRequested: "2023-06-14T14:45:00",
      approvalNeeded: 3,
      approvalsReceived: 2,
    },
    {
      id: "req-003",
      requesterId: "gov-001",
      requesterName: "Treasury Department",
      requesterType: "government",
      amount: 500000,
      purpose: "Social welfare payments",
      status: "processing",
      dateRequested: "2023-06-13T09:15:00",
      approvalNeeded: 3,
      approvalsReceived: 3,
    },
    {
      id: "req-004",
      requesterId: "bank-003",
      requesterName: "Citizen's Cooperative Bank",
      requesterType: "commercial_bank",
      amount: 125000,
      purpose: "Rural branch expansion",
      status: "approved",
      dateRequested: "2023-06-12T16:20:00",
      approvalNeeded: 3,
      approvalsReceived: 3,
    },
  ],
  mintingHistory = [
    {
      id: "mint-001",
      amount: 500000,
      operationType: "mint",
      status: "completed",
      date: "2023-06-10T11:05:00",
      authorizedBy: ["John Smith", "Maria Garcia", "Robert Chen"],
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j",
      purpose: "Quarterly allocation to commercial banks",
    },
    {
      id: "mint-002",
      amount: 250000,
      operationType: "mint",
      status: "completed",
      date: "2023-06-05T09:30:00",
      authorizedBy: ["John Smith", "Maria Garcia", "Robert Chen"],
      transactionHash: "0x2b3c4d5e6f7g8h9i0j1k",
      purpose: "Government social welfare program",
    },
    {
      id: "mint-003",
      amount: 100000,
      operationType: "burn",
      status: "completed",
      date: "2023-06-01T14:15:00",
      authorizedBy: ["John Smith", "Maria Garcia", "Robert Chen"],
      transactionHash: "0x3c4d5e6f7g8h9i0j1k2l",
      purpose: "Monetary policy adjustment",
    },
  ],
}: CentralBankMintingProps) => {
  const [newMintAmount, setNewMintAmount] = useState<string>("");
  const [mintPurpose, setMintPurpose] = useState<string>("");
  const [mintType, setMintType] = useState<"mint" | "burn">("mint");
  const [showMintDialog, setShowMintDialog] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "requests",
  );

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleNewMintAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNewMintAmount(value);
  };

  const handleMintPurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintPurpose(e.target.value);
  };

  const handleMintTypeChange = (value: string) => {
    setMintType(value as "mint" | "burn");
  };

  const handleInitiateMint = () => {
    // In a real app, this would send the minting request to the backend
    console.log("Initiating mint operation:", {
      amount: parseInt(newMintAmount),
      purpose: mintPurpose,
      type: mintType,
    });
    setShowMintDialog(false);
    setNewMintAmount("");
    setMintPurpose("");
    setMintType("mint");
  };

  const handleApproveRequest = (requestId: string) => {
    // In a real app, this would send the approval to the backend
    console.log("Approving request:", requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // In a real app, this would send the rejection to the backend
    console.log("Rejecting request:", requestId);
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

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Central Bank Minting Control</h1>
          <p className="text-muted-foreground mt-1">
            Manage and authorize CBDC minting operations
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Banknote size={16} />
                Initiate Minting Operation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Minting Operation</DialogTitle>
                <DialogDescription>
                  Create a new CBDC{" "}
                  {mintType === "mint" ? "minting" : "burning"} operation. This
                  requires multi-signature approval.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="operation-type" className="text-right">
                    Operation
                  </Label>
                  <Select value={mintType} onValueChange={handleMintTypeChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select operation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mint">Mint New CBDC</SelectItem>
                      <SelectItem value="burn">Burn Existing CBDC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-muted-foreground">CBDC</span>
                    <Input
                      id="amount"
                      value={newMintAmount}
                      onChange={handleNewMintAmountChange}
                      placeholder="Enter amount"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purpose" className="text-right">
                    Purpose
                  </Label>
                  <Input
                    id="purpose"
                    value={mintPurpose}
                    onChange={handleMintPurposeChange}
                    placeholder="Purpose of this operation"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Approvals</Label>
                  <div className="col-span-3">
                    <Badge variant="outline" className="mr-2">
                      3 signatures required
                    </Badge>
                    <Badge variant="outline">
                      Multi-signature authorization
                    </Badge>
                  </div>
                </div>
                {mintType === "mint" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Limits</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Limit:</span>
                        <span>
                          {formatCurrency(mintingLimits.dailyUsed)} /{" "}
                          {formatCurrency(mintingLimits.daily)} CBDC
                        </span>
                      </div>
                      <Progress
                        value={
                          (mintingLimits.dailyUsed / mintingLimits.daily) * 100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm">
                        <span>Monthly Limit:</span>
                        <span>
                          {formatCurrency(mintingLimits.monthlyUsed)} /{" "}
                          {formatCurrency(mintingLimits.monthly)} CBDC
                        </span>
                      </div>
                      <Progress
                        value={
                          (mintingLimits.monthlyUsed / mintingLimits.monthly) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowMintDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInitiateMint}
                  disabled={
                    !newMintAmount ||
                    !mintPurpose ||
                    (mintType === "mint" &&
                      parseInt(newMintAmount) >
                        mintingLimits.daily - mintingLimits.dailyUsed)
                  }
                >
                  Initiate {mintType === "mint" ? "Minting" : "Burning"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Report
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
              Daily Minting Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(mintingLimits.daily)} CBDC
              </div>
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  Used today: {formatCurrency(mintingLimits.dailyUsed)}
                </span>
                <span
                  className={
                    (mintingLimits.dailyUsed / mintingLimits.daily) * 100 > 80
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }
                >
                  {Math.round(
                    (mintingLimits.dailyUsed / mintingLimits.daily) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(mintingLimits.dailyUsed / mintingLimits.daily) * 100}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Minting Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(mintingLimits.monthly)} CBDC
              </div>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  Used this month: {formatCurrency(mintingLimits.monthlyUsed)}
                </span>
                <span
                  className={
                    (mintingLimits.monthlyUsed / mintingLimits.monthly) * 100 >
                    80
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }
                >
                  {Math.round(
                    (mintingLimits.monthlyUsed / mintingLimits.monthly) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={
                  (mintingLimits.monthlyUsed / mintingLimits.monthly) * 100
                }
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Minting Requests */}
      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <button
            className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "requests" ? "bg-muted" : ""}`}
            onClick={() => toggleSection("requests")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-800" />
              </div>
              <div>
                <h3 className="font-medium">Pending Minting Requests</h3>
                <p className="text-xs text-muted-foreground">
                  Requests from commercial banks and government agencies
                </p>
              </div>
            </div>
            {expandedSection === "requests" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSection === "requests" && (
            <div className="p-4 border-t">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requester</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approvals</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mintingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.requesterName}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.requesterType === "commercial_bank"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                : "bg-green-50 text-green-700 hover:bg-green-50"
                            }
                          >
                            {request.requesterType === "commercial_bank"
                              ? "Commercial Bank"
                              : "Government"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(request.amount)} CBDC
                        </TableCell>
                        <TableCell>{request.purpose}</TableCell>
                        <TableCell>
                          {formatDate(request.dateRequested)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "processing"
                                  ? "secondary"
                                  : request.status === "rejected"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">
                              {request.approvalsReceived}/
                              {request.approvalNeeded}
                            </span>
                            <Progress
                              value={
                                (request.approvalsReceived /
                                  request.approvalNeeded) *
                                100
                              }
                              className="h-2 w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === "pending" && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                          handleApproveRequest(request.id)
                                        }
                                      >
                                        <Check className="h-4 w-4 text-green-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Approve Request</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                          >
                                            <X className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Reject Minting Request
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to reject
                                              this minting request from{" "}
                                              {request.requesterName}? This
                                              action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                handleRejectRequest(request.id)
                                              }
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Reject
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Reject Request</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Minting History */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "history" ? "bg-muted" : ""}`}
            onClick={() => toggleSection("history")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Banknote className="h-4 w-4 text-blue-800" />
              </div>
              <div>
                <h3 className="font-medium">Minting Operation History</h3>
                <p className="text-xs text-muted-foreground">
                  Record of all minting and burning operations
                </p>
              </div>
            </div>
            {expandedSection === "history" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSection === "history" && (
            <div className="p-4 border-t">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operation ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Authorized By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mintingHistory.map((operation) => (
                      <TableRow key={operation.id}>
                        <TableCell className="font-medium">
                          {operation.id}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              operation.operationType === "mint"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {operation.operationType === "mint"
                              ? "Mint"
                              : "Burn"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(operation.amount)} CBDC
                        </TableCell>
                        <TableCell>{operation.purpose}</TableCell>
                        <TableCell>{formatDate(operation.date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              operation.status === "completed"
                                ? "default"
                                : operation.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              operation.status === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : operation.status === "processing"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {operation.status.charAt(0).toUpperCase() +
                              operation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {operation.authorizedBy.map((author, index) => (
                              <span
                                key={index}
                                className="text-xs text-muted-foreground"
                              >
                                {author}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Minting Limits Configuration */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "limits" ? "bg-muted" : ""}`}
            onClick={() => toggleSection("limits")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-800" />
              </div>
              <div>
                <h3 className="font-medium">Minting Limits Configuration</h3>
                <p className="text-xs text-muted-foreground">
                  Set and manage minting limits and policies
                </p>
              </div>
            </div>
            {expandedSection === "limits" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSection === "limits" && (
            <div className="p-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Limits</CardTitle>
                    <CardDescription>
                      Maximum amount that can be minted in a 24-hour period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit">Daily Minting Limit</Label>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">CBDC</span>
                        <Input
                          id="daily-limit"
                          value={mintingLimits.daily.toLocaleString()}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Used Today</Label>
                        <span className="text-sm">
                          {Math.round(
                            (mintingLimits.dailyUsed / mintingLimits.daily) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (mintingLimits.dailyUsed / mintingLimits.daily) * 100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Used: {formatCurrency(mintingLimits.dailyUsed)}
                        </span>
                        <span>
                          Available:{" "}
                          {formatCurrency(
                            mintingLimits.daily - mintingLimits.dailyUsed,
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Update Daily Limit
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Limits</CardTitle>
                    <CardDescription>
                      Maximum amount that can be minted in a calendar month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthly-limit">
                        Monthly Minting Limit
                      </Label>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">CBDC</span>
                        <Input
                          id="monthly-limit"
                          value={mintingLimits.monthly.toLocaleString()}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Used This Month</Label>
                        <span className="text-sm">
                          {Math.round(
                            (mintingLimits.monthlyUsed /
                              mintingLimits.monthly) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (mintingLimits.monthlyUsed / mintingLimits.monthly) *
                          100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Used: {formatCurrency(mintingLimits.monthlyUsed)}
                        </span>
                        <span>
                          Available:{" "}
                          {formatCurrency(
                            mintingLimits.monthly - mintingLimits.monthlyUsed,
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Update Monthly Limit
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-medium mb-2">Minting Policy Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Required Approvals</Label>
                      <p className="text-sm text-muted-foreground">
                        Number of authorized signatories required
                      </p>
                    </div>
                    <Select defaultValue="3">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Approval Threshold</Label>
                      <p className="text-sm text-muted-foreground">
                        Requests below this amount are auto-approved
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">CBDC</span>
                      <Input value="10,000" className="w-[150px]" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency Minting Protocol</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow bypassing limits in emergency situations
                      </p>
                    </div>
                    <Select defaultValue="disabled">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CentralBankMinting;
