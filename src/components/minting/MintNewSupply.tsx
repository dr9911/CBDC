import React, { useState } from "react";
import {
  Banknote,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Key,
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
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "../layout/DashboardLayout";

interface MintNewSupplyProps {
  totalSupply?: number;
}

const MintNewSupply = ({ totalSupply = 10000000 }: MintNewSupplyProps) => {
  //
  // ----------------------------------------------------------------
  // 1) FORM STATES AND HANDLERS (FROM THE NEW SNIPPET)
  // ----------------------------------------------------------------
  const [name, setName] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [numTokens, setNumTokens] = useState<string>("");
  const [issuingPrice, setIssuingPrice] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [documentDate, setDocumentDate] = useState<string>("27.02.2025");

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

  //
  // ----------------------------------------------------------------
  // 2) DIALOG STATES & METHODS (EXACTLY FROM OLDER SNIPPET)
  // ----------------------------------------------------------------
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showMfaDialog, setShowMfaDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [mfaCode, setMfaCode] = useState<string>("");

  // "Proceed to Verification" => opens Confirm dialog
  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  // "Confirm Minting Operation" => close confirm, open MFA
  const handleConfirmMinting = () => {
    setShowConfirmDialog(false);
    setShowMfaDialog(true);
  };

  // Once MFA verifies => show success
  const handleVerifyMfa = () => {
    // In real life: verify MFA code
    setShowMfaDialog(false);
    setShowSuccessDialog(true);
  };

  // On success close => reset form
  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    setName("");
    setCurrency("");
    setNumTokens("");
    setIssuingPrice("");
    setPurpose("");
    setDocumentDate("27.02.2025");
    setMfaCode("");
  };

  // Only allow numeric 6-digit codes
  const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setMfaCode(value);
  };

  // Validation
  const isFormValid =
    name && currency && numTokens && issuingPrice && purpose && documentDate;
  const isMfaValid = mfaCode.length === 6;

  //
  // ----------------------------------------------------------------
  // 3) RENDER
  // ----------------------------------------------------------------
  return (
    <DashboardLayout activePage="mint">
      <div className="space-y-6">
        {/* Page Heading */}
        <div>
          <h1 className="text-3xl font-bold">Mint New CBDC Supply</h1>
          <p className="text-muted-foreground mt-1">
            Create new digital currency with secure multi-factor authentication
          </p>
        </div>

        {/* Card: Total Supply */}
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

        {/* Minting Form (from new snippet) */}
        <Card>
          <CardHeader>
            <CardTitle>Mint New Digital Currency</CardTitle>
            <CardDescription>
              Create new CBDC tokens with secure multi-signature approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                      <SelectValue placeholder="PGK" />
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
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Proceed to Verification
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* ----------------------------------------- */}
      {/* (A) CONFIRMATION DIALOG (OLDER VERSION)  */}
      {/* ----------------------------------------- */}
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
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-medium">
                  {currency ? currency.toUpperCase() : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of Tokens:</span>
                <span className="font-medium">
                  {numTokens ? Number(numTokens).toLocaleString() : "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issuing Price:</span>
                <span className="font-medium">
                  {currency ? currency.toUpperCase() : ""}{" "}
                  {issuingPrice ? Number(issuingPrice).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="font-medium">{purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document Date:</span>
                <span className="font-medium">{documentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
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

      {/* ----------------------------------------- */}
      {/* (B) MFA DIALOG (OLDER VERSION)           */}
      {/* ----------------------------------------- */}
      <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code from your authenticator app to verify your
              identity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  A secure 6-digit code has been sent to your authenticator app
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

      {/* ----------------------------------------- */}
      {/* (C) SUCCESS DIALOG (OLDER VERSION)       */}
      {/* ----------------------------------------- */}
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
                  <span className="text-muted-foreground">
                    Number of Tokens:
                  </span>
                  <span className="font-medium">
                    {numTokens ? Number(numTokens).toLocaleString() : "0"} CBDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issuing Price:</span>
                  <span className="font-medium">
                    {currency ? currency.toUpperCase() : "XXX"}{" "}
                    {issuingPrice ? Number(issuingPrice).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You will receive a notification once all required approvals are
                complete and the minting operation is finalized.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseSuccess}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MintNewSupply;
