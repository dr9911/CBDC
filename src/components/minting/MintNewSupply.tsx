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
  Key,
  Lock,
  CheckCircle2,
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
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "../layout/DashboardLayout";

interface MintNewSupplyProps {
  userName?: string;
  userRole?: string;
  totalSupply?: number;
  circulatingSupply?: number;
  mintingLimits?: {
    daily: number;
    monthly: number;
    dailyUsed: number;
    monthlyUsed: number;
  };
}

const MintNewSupply = ({
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
}: MintNewSupplyProps) => {
  const [mintAmount, setMintAmount] = useState<string>("");
  const [mintPurpose, setMintPurpose] = useState<string>("");
  const [mintJustification, setMintJustification] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [showMfaDialog, setShowMfaDialog] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [supply, setSupply] = useState<number>(totalSupply);

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

  const handleMintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMintAmount(value);
  };

  const handleMintPurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintPurpose(e.target.value);
  };

  const handleMintJustificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMintJustification(e.target.value);
  };

  const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMfaCode(value);
  };

  const handleNextStep = () => {
    if (step === 1) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmMinting = async () => {
    setShowConfirmDialog(false);
    setShowMfaDialog(true);
    setTimeout(() => {
      setSupply(prevSupply => prevSupply + parseInt(mintAmount, 10));
    }, 60000);  

  };
  

  const handleVerifyMfa = () => {
    // In a real app, this would verify the MFA code with the backend
    setShowMfaDialog(false);
    setShowSuccessDialog(true);

    // Reset form
    setMintAmount("");
    setMintPurpose("");
    setMintJustification("");
    setMfaCode("");
    setStep(1);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
  };

  const isFormValid = mintAmount && mintPurpose && mintJustification;
  const isMfaValid = mfaCode.length === 6;
  const mintAmountValue = parseInt(mintAmount) || 0;
  const isOverLimit =
    mintAmountValue > mintingLimits.daily - mintingLimits.dailyUsed;

  return (
    <DashboardLayout activePage="mint">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mint New DUAL Supply</h1>
            <p className="text-muted-foreground mt-1">
              Create new digital currency with secure multi-factor
              authentication
            </p>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total DUAL Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(supply)} DUAL
                </div>
                <Banknote className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Authorized by Central Bank
              </p>
            </CardContent>
          </Card>

          {/* <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Circulating Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(circulatingSupply)} DUAL
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
          </Card> */}
        </div>

        {/* Minting Form */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Mint New Digital Currency</CardTitle>
            <CardDescription>
              Create new CBDC tokens with secure multi-signature approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mint-amount">Minting Amount</Label>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground flex items-center px-3 border rounded-l-md border-r-0">
                      CBDC
                    </span>
                    <Input
                      id="mint-amount"
                      value={mintAmount}
                      onChange={handleMintAmountChange}
                      placeholder="Enter amount to mint"
                      className="flex-1 rounded-l-none"
                    />
                  </div>
                  {isOverLimit && (
                    <p className="text-sm text-destructive">
                      Amount exceeds daily minting limit. Maximum available:{" "}
                      {formatCurrency(
                        mintingLimits.daily - mintingLimits.dailyUsed,
                      )}{" "}
                      CBDC
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint-purpose">Purpose</Label>
                  <Input
                    id="mint-purpose"
                    value={mintPurpose}
                    onChange={handleMintPurposeChange}
                    placeholder="E.g., Quarterly allocation, Emergency liquidity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mint-justification">
                    Detailed Justification
                  </Label>
                  <Textarea
                    id="mint-justification"
                    value={mintJustification}
                    onChange={handleMintJustificationChange}
                    placeholder="Provide detailed reasoning for this minting operation"
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Security Requirements
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span>
                        Multi-signature approval required (3 authorized
                        officers)
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span>Two-factor authentication verification</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span>Detailed audit log of all minting operations</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span>Compliance with monetary policy guidelines</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h3 className="font-medium mb-3 flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Important Notice
                  </h3>
                  <p className="text-sm text-amber-700">
                    Minting new CBDC directly affects the monetary supply. All
                    operations are permanently recorded on the blockchain and
                    cannot be reversed. Please ensure all information is
                    accurate before proceeding.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-3">Approval Process</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                        1
                      </span>
                      <span>Submit minting request with required details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                        2
                      </span>
                      <span>
                        Verify identity with two-factor authentication
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                        3
                      </span>
                      <span>Await approval from other authorized officers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">
                        4
                      </span>
                      <span>
                        Minting operation executed after all approvals
                      </span>
                    </li>
                  </ol>
                </div>
              </div> */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleNextStep}
              disabled={!isFormValid || isOverLimit}
            >
              Proceed to Verification
            </Button>
          </CardFooter>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Minting Operation</DialogTitle>
              <DialogDescription>
                Please review the details of this minting operation before
                proceeding.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(parseInt(mintAmount))} CBDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose:</span>
                  <span className="font-medium">{mintPurpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested by:</span>
                  <span className="font-medium">{userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{userRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">
                      This action requires additional verification
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      You will need to complete two-factor authentication to
                      proceed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmMinting}>
                Proceed to Authentication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MFA Dialog */}
        <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Enter the 6-digit code from your authenticator app to verify
                your identity.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Key className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    A secure 6-digit code has been sent to your authenticator
                    app
                  </p>
                </div>
                <div className="w-full max-w-[200px]">
                  <Input
                    value={mfaCode}
                    onChange={handleMfaCodeChange}
                    maxLength={6}
                    placeholder="000000"
                    className="text-center text-xl tracking-widest"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMfaDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleVerifyMfa} disabled={!isMfaValid}>
                Verify & Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Minting Request Submitted</DialogTitle>
              <DialogDescription>
                Your request to mint new CBDC has been successfully submitted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">
                    Request ID: MINT-
                    {Math.floor(Math.random() * 1000000)
                      .toString()
                      .padStart(6, "0")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Submitted on {new Date().toLocaleString()}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                    >
                      Awaiting Approvals (1/3)
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(parseInt(mintAmount) || 0)} CBDC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated completion:
                    </span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You will receive a notification when all approvals are
                  complete and the minting operation is executed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCloseSuccess}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MintNewSupply;
