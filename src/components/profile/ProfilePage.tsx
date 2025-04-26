import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "../layout/DashboardLayout";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Use current user details from AuthContext
  const userName = currentUser.name;
  const userAvatar =
    currentUser.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      userName
    )}`;

  // Build profile data from currentUser; using fallback values for properties not provided
  const profileData = {
    name: currentUser.name,
    email: currentUser.email,
    phone: "N/A",
    address: "N/A",
    dateJoined: currentUser.lastLogin
      ? new Date(currentUser.lastLogin).toLocaleDateString()
      : "N/A",
    accountId: currentUser.id,
    verificationLevel: "Advanced",
    twoFactorEnabled: false,
  };

  // Tabs and Dialog state
  const [activeTab, setActiveTab] = useState("profile");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendNote, setSendNote] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [qrSize, setQrSize] = useState("medium");

  // Additional Dialog states
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showTwoFADialog, setShowTwoFADialog] = useState(false);
  const [showLoginHistoryDialog, setShowLoginHistoryDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
  const [showConfigureEmailDialog, setShowConfigureEmailDialog] =
    useState(false);
  const [showConfigureSMSDialog, setShowConfigureSMSDialog] = useState(false);
  const [
    showConfigureAppNotificationsDialog,
    setShowConfigureAppNotificationsDialog,
  ] = useState(false);

  // 1) Email Notification Settings
  const [emailSettings, setEmailSettings] = useState({
    newsletter: false,
    securityAlerts: false,
    productUpdates: false,
  });

  // 2) SMS Notification Settings
  const [smsSettings, setSmsSettings] = useState({
    receiveSMSAlerts: false,
  });

  // 3) App Notification Settings
  const [appSettings, setAppSettings] = useState({
    enablePushNotifications: false,
  });

  // On mount, load existing notification settings from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("emailSettings");
    if (storedEmail) {
      setEmailSettings(JSON.parse(storedEmail));
    }
    const storedSMS = localStorage.getItem("smsSettings");
    if (storedSMS) {
      setSmsSettings(JSON.parse(storedSMS));
    }
    const storedApp = localStorage.getItem("appSettings");
    if (storedApp) {
      setAppSettings(JSON.parse(storedApp));
    }
  }, []);

  // Handlers for saving each type of notification settings
  const handleSaveEmailSettings = () => {
    localStorage.setItem("emailSettings", JSON.stringify(emailSettings));
    setShowConfigureEmailDialog(false);
  };
  const handleSaveSMSSettings = () => {
    localStorage.setItem("smsSettings", JSON.stringify(smsSettings));
    setShowConfigureSMSDialog(false);
  };
  const handleSaveAppSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(appSettings));
    setShowConfigureAppNotificationsDialog(false);
  };

  // Send & Receive
  const handleSendMoney = () => {
    setShowSendDialog(false);
    setShowSuccessDialog(true);
    setSendAmount("");
    setSendRecipient("");
    setSendNote("");
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      accountId: profileData.accountId,
      accountName: profileData.name,
      amount: receiveAmount ? parseFloat(receiveAmount) : 0,
      currency: "DUAL",
      timestamp: new Date().toISOString(),
    })
  )}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(profileData.accountId);
    // No alert popup; you could show a toast or something else if you want
    // For a quick feedback, you can do:
    console.log("Account ID copied to clipboard");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `dual-payment-request-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      console.log("Web Share API not supported in your browser");
    }
  };

  return (
    <DashboardLayout userName={userName} userAvatar={userAvatar}>
      <div className="space-y-6 p-4 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
        
        </div>
        {/* Profile Summary & Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </Card>
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
              {/* Profile Details Tab */}
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
                  </CardContent>
                  {/* <CardFooter className="flex justify-end pt-[50px]">
                    <Button>Save Changes</Button>
                  </CardFooter> */}
                </Card>
              </TabsContent>
              {/* Security Tab */}
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
                        <Button
                          variant="outline"
                          onClick={() => setShowTwoFADialog(true)}
                        >
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
                        <Button
                          variant="outline"
                          onClick={() => setShowLoginHistoryDialog(true)}
                        >
                          View History
                        </Button>
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
                        <Button
                          variant="outline"
                          onClick={() => setShowChangePasswordDialog(true)}
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Preferences Tab */}
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
                        <Button
                          variant="outline"
                          onClick={() => setShowConfigureEmailDialog(true)}
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Get important alerts via text message
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowConfigureSMSDialog(true)}
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">App Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Control push notifications on your devices
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setShowConfigureAppNotificationsDialog(true)
                          }
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Dialogs for Send, Receive, and Transaction Success */}
        <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Send Money</DialogTitle>
              <DialogDescription>
                Transfer CBDC to another account securely
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
                      <SelectItem value="dual">CBDC</SelectItem>
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
                      <SelectItem value="dual">CBDC</SelectItem>
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
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
              <Button size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                  <span className="font-medium">{sendAmount || "0"} CBDC</span>
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

        {/* Additional Dialogs for Demo Editing */}

        {/* Edit Profile Dialog */}
        <Dialog
          open={showEditProfileDialog}
          onOpenChange={setShowEditProfileDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editFullName">Full Name</Label>
                <Input id="editFullName" defaultValue={profileData.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email Address</Label>
                <Input
                  id="editEmail"
                  type="email"
                  defaultValue={profileData.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input id="editPhone" defaultValue={profileData.phone} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Input id="editAddress" defaultValue={profileData.address} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editBio">Bio</Label>
                <Textarea
                  id="editBio"
                  placeholder="Tell us a little about yourself"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditProfileDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // For demo, just close dialog
                  // You could also store changes in localStorage if desired
                  setShowEditProfileDialog(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Two-Factor Authentication Dialog */}
        <Dialog open={showTwoFADialog} onOpenChange={setShowTwoFADialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                {profileData.twoFactorEnabled
                  ? "Manage your two-factor authentication settings."
                  : "Enable two-factor authentication for added security."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {profileData.twoFactorEnabled ? (
                <div>
                  <p>Two-Factor Authentication is currently enabled.</p>
                  <Button
                    onClick={() => {
                      // For demo only
                      console.log("2FA disabled (demo)");
                      setShowTwoFADialog(false);
                    }}
                  >
                    Disable 2FA
                  </Button>
                </div>
              ) : (
                <div>
                  <p>Two-Factor Authentication is currently disabled.</p>
                  <Button
                    onClick={() => {
                      // For demo only
                      console.log("2FA enabled (demo)");
                      setShowTwoFADialog(false);
                    }}
                  >
                    Enable 2FA
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowTwoFADialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Login History Dialog */}
        <Dialog
          open={showLoginHistoryDialog}
          onOpenChange={setShowLoginHistoryDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Login History</DialogTitle>
              <DialogDescription>
                View your recent login activities.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ul className="list-disc pl-5">
                <li>
                  {new Date().toLocaleString()} - Successful login from IP
                  192.168.1.1
                </li>
                <li>
                  {new Date().toLocaleString()} - Successful login from IP
                  192.168.1.2
                </li>
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowLoginHistoryDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog
          open={showChangePasswordDialog}
          onOpenChange={setShowChangePasswordDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Update your account password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // For demo only
                  console.log("Password changed (demo)");
                  setShowChangePasswordDialog(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configure Email Notifications Dialog */}
        <Dialog
          open={showConfigureEmailDialog}
          onOpenChange={setShowConfigureEmailDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Email Notifications</DialogTitle>
              <DialogDescription>
                Configure your email notification preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                {/* Newsletter */}
                <div className="flex items-center">
                  <Input
                    type="checkbox"
                    id="newsletter"
                    className="h-4 w-4 mr-2"
                    checked={emailSettings.newsletter}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        newsletter: e.target.checked,
                      })
                    }
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Newsletter
                  </Label>
                </div>
                {/* Security Alerts */}
                <div className="flex items-center">
                  <Input
                    type="checkbox"
                    id="alerts"
                    className="h-4 w-4 mr-2"
                    checked={emailSettings.securityAlerts}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        securityAlerts: e.target.checked,
                      })
                    }
                  />
                  <Label htmlFor="alerts" className="text-sm">
                    Security Alerts
                  </Label>
                </div>
                {/* Product Updates */}
                <div className="flex items-center">
                  <Input
                    type="checkbox"
                    id="updates"
                    className="h-4 w-4 mr-2"
                    checked={emailSettings.productUpdates}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        productUpdates: e.target.checked,
                      })
                    }
                  />
                  <Label htmlFor="updates" className="text-sm">
                    Product Updates
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfigureEmailDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEmailSettings}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configure SMS Notifications Dialog */}
        <Dialog
          open={showConfigureSMSDialog}
          onOpenChange={setShowConfigureSMSDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>SMS Notifications</DialogTitle>
              <DialogDescription>
                Configure your SMS notification preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="smsAlerts"
                  className="h-4 w-4 mr-2"
                  checked={smsSettings.receiveSMSAlerts}
                  onChange={(e) =>
                    setSmsSettings({
                      ...smsSettings,
                      receiveSMSAlerts: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="smsAlerts" className="text-sm">
                  Receive SMS Alerts
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfigureSMSDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSMSSettings}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Configure App Notifications Dialog */}
        <Dialog
          open={showConfigureAppNotificationsDialog}
          onOpenChange={setShowConfigureAppNotificationsDialog}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>App Notifications</DialogTitle>
              <DialogDescription>
                Configure your app push notification preferences.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="pushNotifications"
                  className="h-4 w-4 mr-2"
                  checked={appSettings.enablePushNotifications}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      enablePushNotifications: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="pushNotifications" className="text-sm">
                  Enable Push Notifications
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfigureAppNotificationsDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAppSettings}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
