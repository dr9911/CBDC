import React, { useState } from "react";
import { Banknote, Calendar, Check, Shield, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "../layout/DashboardLayout";
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
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface MintNewSupplyProps {
  totalSupply?: number;
}

const MintNewSupply = ({ totalSupply = 10000000 }: MintNewSupplyProps) => {
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [numTokens, setNumTokens] = useState<string>("");
  const [issuingPrice, setIssuingPrice] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [documentDate, setDocumentDate] = useState<string>("27.02.2025");

  // Dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [mfaCode, setMfaCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState(1);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleNumTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setNumTokens(value);
  };

  const handleIssuingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setIssuingPrice(value);
  };

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose(e.target.value);
  };

  const handleDocumentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentDate(e.target.value);
  };

  const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 6 digits
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setMfaCode(value);
  };

  const handleSubmit = () => {
    // Open confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmMinting = () => {
    // Close confirmation dialog and open MFA dialog
    setShowConfirmDialog(false);
    setShowMfaDialog(true);
  };

  const handleVerifyMfa = () => {
    // Close MFA dialog and show processing
    setShowMfaDialog(false);
    setIsProcessing(true);

    // Simulate processing with progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setShowSuccessDialog(true);
      }
    }, 150);
  };

  const handleCloseSuccess = () => {
    // Reset everything
    setShowSuccessDialog(false);
    setName("");
    setCurrency("");
    setNumTokens("");
    setIssuingPrice("");
    setPurpose("");
    setDocumentDate("27.02.2025");
    setMfaCode("");
    setProgress(0);
    setVerificationStep(1);
  };

  const handleNextStep = () => {
    if (verificationStep < 3) {
      setVerificationStep(verificationStep + 1);
    } else {
      handleVerifyMfa();
    }
  };

  const isFormValid =
    name && currency && numTokens && issuingPrice && purpose && documentDate;

  const isMfaValid = mfaCode.length === 6;

  return (
    <DashboardLayout activePage="mint">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mint New CBDC Supply</h1>
          <p className="text-muted-foreground mt-1">
            Create new digital currency with secure multi-factor authentication
          </p>
        </div>

        {/* Total Supply Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total CBDC Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {totalSupply.toLocaleString()} CBDC
              </div>
              <Banknote className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Authorized by Central Bank
            </p>
          </CardContent>
        </Card>

        {/* Minting Form */}
        <Card>
          <CardHeader>
            <CardTitle>Mint New Digital Currency</CardTitle>
            <CardDescription>
              Create new CBDC tokens with secure multi-signature approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Eco-System Test Batch 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="PGK - Papua New Guinean Kina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pgk">
                        PGK - Papua New Guinean Kina
                      </SelectItem>
                      <SelectItem value="usd">
                        USD - United States Dollar
                      </SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="num-tokens">Number of tokens</Label>
                  <Input
                    id="num-tokens"
                    value={numTokens}
                    onChange={handleNumTokensChange}
                    placeholder="1,000,000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuing-price">Issuing price</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="pgk" className="w-[180px]">
                      <SelectTrigger>
                        <SelectValue placeholder="PGK - Papua New" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pgk">PGK - Papua New</SelectItem>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="issuing-price"
                      value={issuingPrice}
                      onChange={handleIssuingPriceChange}
                      placeholder="1.00"
                      className="flex-1 min-w-[200px]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-medium mb-4">Properties</h3>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={purpose}
                      onChange={handlePurposeChange}
                      placeholder="Enter purpose"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="document-date">Document date</Label>
                    <div className="relative">
                      <Input
                        id="document-date"
                        type="text"
                        value={documentDate}
                        onChange={handleDocumentDateChange}
                        placeholder="27.02.2025"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        type="button"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Proceed to Verification
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Minting Request</DialogTitle>
            <DialogDescription>
              Please review the details of your minting request before
              proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-sm">{name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Currency
                </p>
                <p className="text-sm">{currency.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Number of Tokens
                </p>
                <p className="text-sm">{Number(numTokens).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Issuing Price
                </p>
                <p className="text-sm">
                  {currency.toUpperCase()} {Number(issuingPrice).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Purpose
                </p>
                <p className="text-sm">{purpose}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Document Date
                </p>
                <p className="text-sm">{documentDate}</p>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                By proceeding, you confirm that you are authorized to mint new
                CBDC tokens and that all information provided is accurate.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmMinting}>Confirm & Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MFA Verification Dialog */}
      <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Multi-Factor Authentication</DialogTitle>
            <DialogDescription>
              Please complete the verification process to authorize this minting
              request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${verificationStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {verificationStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <div className="h-0.5 w-8 bg-muted"></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${verificationStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {verificationStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <div className="h-0.5 w-8 bg-muted"></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${verificationStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
              </div>
            </div>

            {verificationStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Biometric Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your fingerprint or face ID to verify your identity
                    </p>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">
                      Touch ID Verification
                    </p>
                    <div className="w-16 h-16 mx-auto border-2 border-primary rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Hardware Key Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Insert your hardware security key to continue
                    </p>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-2">
                      Insert Security Key
                    </p>
                    <div className="w-16 h-8 mx-auto border-2 border-primary rounded-md flex items-center justify-center">
                      <div className="w-12 h-4 bg-primary/10 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Authentication Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mfa-code">Authentication Code</Label>
                  <Input
                    id="mfa-code"
                    value={mfaCode}
                    onChange={handleMfaCodeChange}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMfaDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={verificationStep === 3 && !isMfaValid}
            >
              {verificationStep < 3 ? "Next" : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Minting Request</DialogTitle>
            <DialogDescription>
              Please wait while we process your minting request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={progress} className="w-full" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verifying authorization</span>
                <span>{progress >= 30 ? "Complete" : "In progress..."}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Creating tokens</span>
                <span>
                  {progress >= 60
                    ? "Complete"
                    : progress >= 30
                      ? "In progress..."
                      : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Recording transaction</span>
                <span>
                  {progress >= 90
                    ? "Complete"
                    : progress >= 60
                      ? "In progress..."
                      : "Pending"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Finalizing</span>
                <span>
                  {progress >= 100
                    ? "Complete"
                    : progress >= 90
                      ? "In progress..."
                      : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Minting Successful</DialogTitle>
            <DialogDescription>
              Your minting request has been successfully processed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium">Transaction Complete</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {Number(numTokens).toLocaleString()} CBDC tokens have been
                minted successfully.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Transaction ID</p>
                  <p className="text-muted-foreground">
                    TXN-
                    {Math.floor(Math.random() * 1000000)
                      .toString()
                      .padStart(6, "0")}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-green-600">Completed</p>
                </div>
                <div>
                  <p className="font-medium">Authorized By</p>
                  <p className="text-muted-foreground">
                    Central Bank Authority
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseSuccess} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MintNewSupply;
