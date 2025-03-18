import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Send,
  QrCode,
  Check,
  AlertTriangle,
  Copy,
  Download,
  Share2,
  ArrowRight,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "../layout/DashboardLayout";

interface ProfilePageProps {
  userName?: string;
  userAvatar?: string;
}

const ProfilePage = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: ProfilePageProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendNote, setSendNote] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [qrSize, setQrSize] = useState("medium");

  // User profile data
  const profileData = {
    name: userName,
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    dateJoined: "January 15, 2023",
    accountId: "DUAL-1234-5678-9012",
    verificationLevel: "Advanced",
    twoFactorEnabled: true,
  };

  // Handle send money form submission
  const handleSendMoney = () => {
    // In a real app, this would process the transaction
    setShowSendDialog(false);
    setShowSuccessDialog(true);
    // Reset form
    setSendAmount("");
    setSendRecipient("");
    setSendNote("");
  };

  // Mock QR code image URL for receive money
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      accountId: profileData.accountId,
      accountName: profileData.name,
      amount: receiveAmount ? parseFloat(receiveAmount) : 0,
      currency: "DUAL",
      timestamp: new Date().toISOString(),
    }),
  )}`;

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(profileData.accountId);
    alert("Account ID copied to clipboard");
  };

  // Handle QR code download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `dual-payment-request-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "DUAL Payment Request",
          text: `Payment request for ${receiveAmount || "0"} DUAL`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Web Share API not supported in your browser");
    }
  };

  return (
    <DashboardLayout userName={userName} userAvatar={userAvatar}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowReceiveDialog(true)}
            >
              <QrCode className="mr-2 h-4 w-4" /> Receive Money
            </Button>
            <Button onClick={() => setShowSendDialog(true)}>
              <Send className="mr-2 h-4 w-4" /> Send Money
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1 bg-card">
            <CardHeader className="pb-2">
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground mb-4">{profileData.email}</p>
              <div className="flex flex-col w-full space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">Account ID</span>
                  <span className="text-sm">{profileData.accountId}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">Verification</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    {profileData.verificationLevel}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">2FA</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                  >
                    {profileData.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm">{profileData.dateJoined}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardFooter>
          </Card>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="flex items-center border rounded-md pl-3 bg-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            defaultValue={profileData.name}
                            className="border-0 bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center border rounded-md pl-3 bg-muted">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            defaultValue={profileData.email}
                            className="border-0 bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex items-center border rounded-md pl-3 bg-muted">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            defaultValue={profileData.phone}
                            className="border-0 bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="flex items-center border rounded-md pl-3 bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="address"
                            defaultValue={profileData.address}
                            className="border-0 bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a little about yourself"
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t pt-4">
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">
                          {profileData.twoFactorEnabled ? "Manage" : "Enable"}
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">Login History</h3>
                            <p className="text-sm text-muted-foreground">
                              View your recent login activity
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">View History</Button>
                      </div>

                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Password</h3>
                            <p className="text-sm text-muted-foreground">
                              Change your password regularly for better security
                            </p>
                          </div>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive updates and alerts via email
                          </p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Get important alerts via text message
                          </p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">App Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Control push notifications on your devices
                          </p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Send Money Dialog */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Money</DialogTitle>
              <DialogDescription>
                Transfer DUAL to another account securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="Enter wallet address or username"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                  <Select defaultValue="dual">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dual">DUAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note for this transaction"
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Transaction</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All transactions are encrypted and protected
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSendDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMoney}
                disabled={!sendRecipient || !sendAmount}
              >
                Send Money
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Receive Money Dialog */}
        <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Receive Money</DialogTitle>
              <DialogDescription>
                Share your QR code or wallet address to receive payments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img
                  src={qrImageUrl}
                  alt="Payment QR Code"
                  className={`
                    ${qrSize === "small" ? "w-32 h-32" : ""}
                    ${qrSize === "medium" ? "w-48 h-48" : ""}
                    ${qrSize === "large" ? "w-64 h-64" : ""}
                  `}
                />
              </div>

              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium">
                  Account ID:{" "}
                  <span className="font-normal">{profileData.accountId}</span>
                </p>
                <p className="font-medium">
                  Account Name:{" "}
                  <span className="font-normal">{profileData.name}</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receive-amount">
                  Requested Amount (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="receive-amount"
                    type="number"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Select value="dual">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dual">DUAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr-size">QR Code Size</Label>
                <Select value={qrSize} onValueChange={setQrSize}>
                  <SelectTrigger id="qr-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <Button size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transaction Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Transaction Confirmed</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Success!</h3>
              <p className="text-center text-muted-foreground">
                Your transaction has been successfully processed.
              </p>
              <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{sendAmount || "0"} DUAL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-medium">{sendRecipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">
                    TX-
                    {Math.floor(Math.random() * 1000000)
                      .toString()
                      .padStart(6, "0")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowSuccessDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
