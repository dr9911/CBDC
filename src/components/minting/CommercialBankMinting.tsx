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
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Send,
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
import { Textarea } from "@/components/ui/textarea";

interface CommercialBankMintingProps {
  bankName?: string;
  bankId?: string;
  cbdcBalance?: number;
  allocationLimit?: number;
  allocationUsed?: number;
  mintingRequests?: MintingRequest[];
  allocationHistory?: AllocationHistory[];
}

interface MintingRequest {
  id: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "processing";
  dateRequested: string;
  approvalNeeded: number;
  approvalsReceived: number;
  notes?: string;
  estimatedCompletionDate?: string;
}

interface AllocationHistory {
  id: string;
  amount: number;
  status: "completed" | "failed" | "processing";
  dateRequested: string;
  dateCompleted?: string;
  purpose: string;
  transactionHash?: string;
}

const CommercialBankMinting = ({
  bankName = "First National Bank",
  bankId = "bank-001",
  cbdcBalance = 1250000,
  allocationLimit = 2000000,
  allocationUsed = 1250000,
  mintingRequests = [
    {
      id: "req-001",
      amount: 250000,
      purpose: "Quarterly allocation",
      status: "pending",
      dateRequested: "2023-06-15T10:30:00",
      approvalNeeded: 3,
      approvalsReceived: 1,
      estimatedCompletionDate: "2023-06-18T10:30:00",
    },
    {
      id: "req-002",
      amount: 175000,
      purpose: "Branch expansion funding",
      status: "approved",
      dateRequested: "2023-06-10T14:45:00",
      approvalNeeded: 3,
      approvalsReceived: 3,
      estimatedCompletionDate: "2023-06-12T14:45:00",
    },
    {
      id: "req-003",
      amount: 100000,
      purpose: "Emergency liquidity",
      status: "rejected",
      dateRequested: "2023-06-05T09:15:00",
      approvalNeeded: 3,
      approvalsReceived: 0,
      notes:
        "Request exceeds emergency allocation limits. Please resubmit with proper justification.",
    },
  ],
  allocationHistory = [
    {
      id: "alloc-001",
      amount: 500000,
      status: "completed",
      dateRequested: "2023-05-15T10:30:00",
      dateCompleted: "2023-05-17T14:20:00",
      purpose: "Quarterly allocation",
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j",
    },
    {
      id: "alloc-002",
      amount: 250000,
      status: "completed",
      dateRequested: "2023-04-10T09:15:00",
      dateCompleted: "2023-04-11T16:45:00",
      purpose: "Customer demand increase",
      transactionHash: "0x2b3c4d5e6f7g8h9i0j1k",
    },
    {
      id: "alloc-003",
      amount: 300000,
      status: "completed",
      dateRequested: "2023-03-05T11:30:00",
      dateCompleted: "2023-03-07T10:15:00",
      purpose: "New branch opening",
      transactionHash: "0x3c4d5e6f7g8h9i0j1k2l",
    },
  ],
}: CommercialBankMintingProps) => {
  const [newRequestAmount, setNewRequestAmount] = useState<string>("");
  const [requestPurpose, setRequestPurpose] = useState<string>("");
  const [requestJustification, setRequestJustification] = useState<string>("");
  const [showRequestDialog, setShowRequestDialog] = useState<boolean>(false);
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

  const handleNewRequestAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setNewRequestAmount(value);
  };

  const handleRequestPurposeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRequestPurpose(e.target.value);
  };

  const handleRequestJustificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setRequestJustification(e.target.value);
  };

  const handleSubmitRequest = () => {
    // In a real app, this would send the minting request to the backend
    console.log("Submitting minting request:", {
      amount: parseInt(newRequestAmount),
      purpose: requestPurpose,
      justification: requestJustification,
    });
    setShowRequestDialog(false);
    setNewRequestAmount("");
    setRequestPurpose("");
    setRequestJustification("");
  };

  const handleCancelRequest = (requestId: string) => {
    // In a real app, this would cancel the request
    console.log("Cancelling request:", requestId);
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
          <h1 className="text-3xl font-bold">CBDC Allocation Management</h1>
          <p className="text-muted-foreground mt-1">
            Request and manage CBDC allocations for {bankName}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Send size={16} />
                Request New Allocation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New CBDC Allocation Request</DialogTitle>
                <DialogDescription>
                  Submit a request to the Central Bank for additional CBDC
                  allocation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-muted-foreground">CBDC</span>
                    <Input
                      id="amount"
                      value={newRequestAmount}
                      onChange={handleNewRequestAmountChange}
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
                    value={requestPurpose}
                    onChange={handleRequestPurposeChange}
                    placeholder="Purpose of this allocation"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="justification" className="text-right pt-2">
                    Justification
                  </Label>
                  <Textarea
                    id="justification"
                    value={requestJustification}
                    onChange={handleRequestJustificationChange}
                    placeholder="Provide detailed justification for this allocation request"
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Allocation</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Allocation:</span>
                      <span>
                        {formatCurrency(allocationUsed)} /{" "}
                        {formatCurrency(allocationLimit)} CBDC
                      </span>
                    </div>
                    <Progress
                      value={(allocationUsed / allocationLimit) * 100}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Used: {formatCurrency(allocationUsed)}</span>
                      <span>
                        Available:{" "}
                        {formatCurrency(allocationLimit - allocationUsed)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={
                    !newRequestAmount ||
                    !requestPurpose ||
                    !requestJustification
                  }
                >
                  Submit Request
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current CBDC Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(cbdcBalance)} CBDC
              </div>
              <Banknote className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Available for distribution to customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Allocation Limit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(allocationLimit)} CBDC
              </div>
              <BarChart3 className="h-5 w-5 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {Math.round((allocationUsed / allocationLimit) * 100)}% used
                </span>
              </div>
              <Progress
                value={(allocationUsed / allocationLimit) * 100}
                className="h-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {
                  mintingRequests.filter((req) => req.status === "pending")
                    .length
                }
              </div>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting central bank approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Allocation Requests */}
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
                <h3 className="font-medium">Allocation Requests</h3>
                <p className="text-xs text-muted-foreground">
                  Track the status of your CBDC allocation requests
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
                      <TableHead>Request ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approvals</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mintingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.id}
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
                            className={
                              request.status === "approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : request.status === "processing"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : request.status === "rejected"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : ""
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
                        <TableCell>
                          {request.estimatedCompletionDate
                            ? formatDate(request.estimatedCompletionDate)
                            : "--"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === "pending" && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        handleCancelRequest(request.id)
                                      }
                                    >
                                      <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Cancel Request</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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

              {/* Rejection Notes */}
              {mintingRequests.some(
                (req) => req.status === "rejected" && req.notes,
              ) && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">
                        Rejected Request Notes
                      </h4>
                      {mintingRequests
                        .filter((req) => req.status === "rejected" && req.notes)
                        .map((req) => (
                          <div key={req.id} className="mt-2">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">{req.id}:</span>{" "}
                              {req.notes}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Allocation History */}
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
                <h3 className="font-medium">Allocation History</h3>
                <p className="text-xs text-muted-foreground">
                  Record of all CBDC allocations received
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
                      <TableHead>Allocation ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocationHistory.map((allocation) => (
                      <TableRow key={allocation.id}>
                        <TableCell className="font-medium">
                          {allocation.id}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(allocation.amount)} CBDC
                        </TableCell>
                        <TableCell>{allocation.purpose}</TableCell>
                        <TableCell>
                          {formatDate(allocation.dateRequested)}
                        </TableCell>
                        <TableCell>
                          {allocation.dateCompleted
                            ? formatDate(allocation.dateCompleted)
                            : "--"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              allocation.status === "completed"
                                ? "default"
                                : allocation.status === "processing"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              allocation.status === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : allocation.status === "processing"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {allocation.status.charAt(0).toUpperCase() +
                              allocation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">
                            {allocation.transactionHash
                              ? `${allocation.transactionHash.substring(0, 6)}...${allocation.transactionHash.substring(allocation.transactionHash.length - 4)}`
                              : "--"}
                          </span>
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

        {/* Allocation Guidelines */}
        <div className="border rounded-lg overflow-hidden">
          <button
            className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "guidelines" ? "bg-muted" : ""}`}
            onClick={() => toggleSection("guidelines")}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-800" />
              </div>
              <div>
                <h3 className="font-medium">Allocation Guidelines</h3>
                <p className="text-xs text-muted-foreground">
                  Central Bank policies for CBDC allocation requests
                </p>
              </div>
            </div>
            {expandedSection === "guidelines" ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSection === "guidelines" && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Request Requirements</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Allocation requests must include detailed justification
                        explaining the need for additional CBDC.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Requests exceeding 20% of your current allocation limit
                        require additional documentation and may take longer to
                        process.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Emergency allocation requests must be marked as such and
                        include explanation of the urgent circumstances.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Processing Timeline</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Standard requests are typically processed within 2-3
                        business days.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Large allocation requests (over 500,000 CBDC) may take
                        5-7 business days for review and approval.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Emergency requests are prioritized and typically
                        processed within 24 hours.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Allocation Limits</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Your bank's allocation limit is determined based on your
                        customer base, transaction volume, and compliance
                        history.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        Allocation limits are reviewed quarterly and may be
                        adjusted based on usage patterns and economic factors.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <span>
                        To request a permanent increase to your allocation
                        limit, please submit a formal application through the
                        Central Bank portal.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialBankMinting;
