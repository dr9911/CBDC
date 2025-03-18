import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  RefreshCw,
  Shield,
  Users,
  Building,
  Database,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  PieChart,
  BarChart3,
  TrendingUp,
  Landmark,
  Send,
} from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import MintingProcess from "./MintingProcess";
import ArchitectureModel from "./ArchitectureModel";
import CBDCInfoCard from "./CBDCInfoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface CBDCDashboardProps {
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  sessionTimeRemaining?: number;
  notificationCount?: number;
}

const CBDCDashboard = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  isAuthenticated = true,
  sessionTimeRemaining = 15,
  notificationCount = 3,
}: CBDCDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "minting",
  );

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Mock data for charts and statistics
  const cbdcStats = {
    totalSupply: 10000000,
    circulatingSupply: 7500000,
    transactionsToday: 15420,
    activeUsers: 125000,
    averageTransactionValue: 250,
    distributionByType: [
      { type: "Commercial Banks", percentage: 45 },
      { type: "Government", percentage: 30 },
      { type: "Direct to Users", percentage: 15 },
      { type: "Reserve", percentage: 10 },
    ],
  };

  return (
    <DashboardLayout
      userName={userName}
      userAvatar={userAvatar}
      isAuthenticated={isAuthenticated}
      sessionTimeRemaining={sessionTimeRemaining}
      notificationCount={notificationCount}
      activePage="cbdc"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">CBDC Information Center</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive overview of Central Bank Digital Currency
                operations
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export Report
              </Button>
              <Button size="sm" className="flex items-center gap-2">
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
                    {cbdcStats.totalSupply.toLocaleString()} CBDC
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
                    {cbdcStats.circulatingSupply.toLocaleString()} CBDC
                  </div>
                  <RefreshCw className="h-5 w-5 text-green-500" />
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {Math.round(
                        (cbdcStats.circulatingSupply / cbdcStats.totalSupply) *
                          100,
                      )}
                      % of total supply
                    </span>
                  </div>
                  <Progress
                    value={
                      (cbdcStats.circulatingSupply / cbdcStats.totalSupply) *
                      100
                    }
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {cbdcStats.transactionsToday.toLocaleString()}
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +12.5% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {cbdcStats.activeUsers.toLocaleString()}
                  </div>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  +5.3% this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="process">Process Flow</TabsTrigger>
              <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <CBDCInfoCard
                  title="CBDC Minting"
                  description="The process of creating new CBDC tokens by the central bank."
                  features={[
                    "Central bank initiates minting requests",
                    "Multi-signature authorization required",
                    "Tokens created with unique identifiers",
                    "Distribution to financial entities",
                  ]}
                  variant="minting"
                  icon={<Banknote className="h-6 w-6" />}
                />

                <CBDCInfoCard
                  title="Two-Tier Architecture"
                  description="The platform's structural design for token distribution and management."
                  features={[
                    "Central bank as top-tier token issuer",
                    "Commercial banks as second-tier distributors",
                    "Modular design for blockchain integration",
                    "Compatible with existing financial systems",
                  ]}
                  variant="architecture"
                  icon={<Database className="h-6 w-6" />}
                />

                <CBDCInfoCard
                  title="CBDC Transactions"
                  description="How users can transfer and use CBDC in the economy."
                  features={[
                    "P2P transfers between users",
                    "Merchant payments",
                    "QR code scanning for payments",
                    "Transaction history tracking",
                  ]}
                  variant="transactions"
                  icon={<RefreshCw className="h-6 w-6" />}
                />

                <CBDCInfoCard
                  title="CBDC Security"
                  description="Security measures protecting the CBDC ecosystem."
                  features={[
                    "Multi-signature authentication",
                    "Unique token identifiers",
                    "Secure transaction verification",
                    "Fraud prevention mechanisms",
                  ]}
                  variant="security"
                  icon={<Shield className="h-6 w-6" />}
                />
              </div>

              {/* CBDC Distribution Chart */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">CBDC Distribution</CardTitle>
                  <CardDescription>
                    Current allocation of CBDC across different entities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Pie Chart Visualization (Simplified) */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-48 h-48 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {/* This is a simplified pie chart visualization */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "conic-gradient(#3b82f6 0% 45%, #10b981 45% 75%, #f59e0b 75% 90%, #6b7280 90% 100%)",
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center">
                            <PieChart className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Distribution Legend */}
                    <div className="flex-1">
                      <h4 className="font-medium mb-4">
                        Distribution by Entity Type
                      </h4>
                      <div className="space-y-4">
                        {cbdcStats.distributionByType.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-green-500" : index === 2 ? "bg-amber-500" : "bg-gray-500"}`}
                                ></div>
                                <span className="text-sm font-medium">
                                  {item.type}
                                </span>
                              </div>
                              <span className="text-sm font-bold">
                                {item.percentage}%
                              </span>
                            </div>
                            <Progress value={item.percentage} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Updates */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">Latest CBDC Updates</CardTitle>
                  <CardDescription>
                    Recent announcements and system changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-blue-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          New Regulatory Framework Published
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          The Central Bank has released updated guidelines for
                          CBDC operations.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Policy
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            2 days ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Banknote className="h-5 w-5 text-green-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">New CBDC Tokens Minted</h4>
                        <p className="text-sm text-muted-foreground">
                          500,000 new CBDC tokens have been minted and
                          distributed to commercial banks.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Minting
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            1 week ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Shield className="h-5 w-5 text-amber-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Security Protocol Update
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Enhanced verification measures have been implemented
                          for high-value transactions.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Security
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            2 weeks ago
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Updates
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Process Flow Tab */}
            <TabsContent value="process" className="space-y-6">
              {/* Detailed Process Flow */}
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">CBDC Lifecycle</CardTitle>
                      <CardDescription>
                        Complete process from minting to circulation
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download size={14} />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Collapsible Sections */}
                    <div className="space-y-4">
                      {/* Minting & Issuance Section */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "minting" ? "bg-muted" : ""}`}
                          onClick={() => toggleSection("minting")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Banknote className="h-4 w-4 text-blue-800" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                1. Minting & Issuance
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Creation and distribution of CBDC tokens
                              </p>
                            </div>
                          </div>
                          {expandedSection === "minting" ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        {expandedSection === "minting" && (
                          <div className="p-4 border-t bg-card">
                            <MintingProcess currentStep={5} />
                          </div>
                        )}
                      </div>

                      {/* System Architecture Section */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "architecture" ? "bg-muted" : ""}`}
                          onClick={() => toggleSection("architecture")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <Database className="h-4 w-4 text-purple-800" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                2. Two-Tier Architecture
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                The platform's structural design for token
                                distribution
                              </p>
                            </div>
                          </div>
                          {expandedSection === "architecture" ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        {expandedSection === "architecture" && (
                          <div className="p-4 border-t bg-card">
                            <ArchitectureModel />
                          </div>
                        )}
                      </div>

                      {/* Transaction Processing Section */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "transactions" ? "bg-muted" : ""}`}
                          onClick={() => toggleSection("transactions")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 text-green-800" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                3. Transaction Processing
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                How CBDC transactions are processed and verified
                              </p>
                            </div>
                          </div>
                          {expandedSection === "transactions" ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        {expandedSection === "transactions" && (
                          <div className="p-4 border-t">
                            <div className="space-y-4">
                              <h4 className="font-medium">Transaction Flow</h4>

                              {/* Transaction Steps */}
                              <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted z-0" />
                                <div className="space-y-6">
                                  <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                                      <span className="text-lg font-semibold">
                                        1
                                      </span>
                                    </div>
                                    <div>
                                      <h5 className="font-medium">
                                        Initiation
                                      </h5>
                                      <p className="text-sm text-muted-foreground">
                                        User initiates a transaction through
                                        wallet app
                                      </p>
                                      <ul className="mt-2 space-y-1">
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Sender enters recipient's wallet
                                            address or scans QR code
                                          </span>
                                        </li>
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Specifies amount and optional
                                            transaction note
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                                      <span className="text-lg font-semibold">
                                        2
                                      </span>
                                    </div>
                                    <div>
                                      <h5 className="font-medium">
                                        Verification
                                      </h5>
                                      <p className="text-sm text-muted-foreground">
                                        Transaction is verified by the network
                                      </p>
                                      <ul className="mt-2 space-y-1">
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            System checks sender's balance and
                                            transaction limits
                                          </span>
                                        </li>
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Validates recipient's wallet address
                                          </span>
                                        </li>
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Applies security protocols based on
                                            transaction value
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                                      <span className="text-lg font-semibold">
                                        3
                                      </span>
                                    </div>
                                    <div>
                                      <h5 className="font-medium">
                                        Settlement
                                      </h5>
                                      <p className="text-sm text-muted-foreground">
                                        Transaction is settled instantly
                                      </p>
                                      <ul className="mt-2 space-y-1">
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            CBDC tokens are transferred from
                                            sender to recipient
                                          </span>
                                        </li>
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Transaction is recorded on the
                                            ledger
                                          </span>
                                        </li>
                                        <li className="text-sm flex items-start gap-2">
                                          <span className="text-muted-foreground mt-1">
                                            •
                                          </span>
                                          <span>
                                            Both parties receive confirmation
                                            notifications
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Redemption & Lifecycle Section */}
                      <div className="border rounded-lg overflow-hidden">
                        <button
                          className={`w-full flex items-center justify-between p-4 text-left ${expandedSection === "redemption" ? "bg-muted" : ""}`}
                          onClick={() => toggleSection("redemption")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-amber-800" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                4. Redemption & Lifecycle
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                How CBDC tokens are redeemed and managed
                              </p>
                            </div>
                          </div>
                          {expandedSection === "redemption" ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        {expandedSection === "redemption" && (
                          <div className="p-4 border-t">
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Redemption Process
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <h5 className="font-medium flex items-center gap-2 mb-3">
                                    <Database className="h-4 w-4 text-primary" />
                                    Token Redemption
                                  </h5>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Users can exchange CBDC for physical
                                        currency at banks
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Commercial banks can redeem excess CBDC
                                        with the central bank
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Redemption requires identity
                                        verification
                                      </span>
                                    </li>
                                  </ul>
                                </div>

                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <h5 className="font-medium flex items-center gap-2 mb-3">
                                    <RefreshCw className="h-4 w-4 text-primary" />
                                    Token Lifecycle Management
                                  </h5>
                                  <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Central bank can remove tokens from
                                        circulation
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Tokens can be programmed with expiry
                                        dates for specific purposes
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-1">
                                        •
                                      </span>
                                      <span>
                                        Damaged or compromised tokens can be
                                        replaced
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ecosystem Tab */}
            <TabsContent value="ecosystem" className="space-y-6">
              {/* Key Actors Section - Enhanced */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">
                    CBDC Ecosystem Participants
                  </CardTitle>
                  <CardDescription>
                    Key actors and their roles in the CBDC network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-muted/30 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Landmark className="h-6 w-6 text-blue-800" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              Central Bank
                            </h3>
                            <Badge variant="outline">Primary Issuer</Badge>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                              <Banknote className="h-3 w-3 text-blue-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Issues and regulates CBDC
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Controls the minting and issuance of all CBDC
                                tokens in the economy
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                              <BarChart3 className="h-3 w-3 text-blue-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Controls monetary policy
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Uses CBDC as a tool for implementing monetary
                                policy decisions
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                              <Shield className="h-3 w-3 text-blue-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Authorizes minting requests
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Provides final approval for all new CBDC token
                                creation
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Building className="h-6 w-6 text-green-800" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              Commercial Banks
                            </h3>
                            <Badge variant="outline">
                              Distribution Partners
                            </Badge>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                              <Users className="h-3 w-3 text-green-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Distribute CBDC to customers
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Act as intermediaries between the central bank
                                and end users
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                              <RefreshCw className="h-3 w-3 text-green-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Provide exchange services
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Allow customers to exchange traditional money
                                for CBDC
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center mt-0.5">
                              <Database className="h-3 w-3 text-green-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Maintain customer wallets
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Provide secure storage and management of CBDC
                                for customers
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-muted/30 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <Users className="h-6 w-6 text-amber-800" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">End Users</h3>
                            <Badge variant="outline">
                              Consumers & Businesses
                            </Badge>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
                              <Send className="h-3 w-3 text-amber-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Send and receive CBDC payments
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Transfer CBDC to other users through digital
                                wallets
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
                              <Banknote className="h-3 w-3 text-amber-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Exchange traditional money for CBDC
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Convert physical cash or bank deposits into CBDC
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
                              <RefreshCw className="h-3 w-3 text-amber-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Use CBDC for everyday transactions
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Pay for goods and services using CBDC
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Building className="h-6 w-6 text-slate-800" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              Government Agencies
                            </h3>
                            <Badge variant="outline">
                              Policy Implementation
                            </Badge>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center mt-0.5">
                              <Users className="h-3 w-3 text-slate-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Distribute social payments
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Use CBDC for direct benefit transfers and
                                subsidies
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center mt-0.5">
                              <FileText className="h-3 w-3 text-slate-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Collect taxes and fees
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Receive tax payments and government fees in CBDC
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center mt-0.5">
                              <BarChart3 className="h-3 w-3 text-slate-800" />
                            </div>
                            <div>
                              <span className="font-medium">
                                Monitor economic activity
                              </span>
                              <p className="text-muted-foreground text-xs mt-0.5">
                                Analyze CBDC transaction data for policy
                                decisions
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ecosystem Interaction Diagram */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Ecosystem Interaction Model
                  </CardTitle>
                  <CardDescription>
                    How different actors interact within the CBDC network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative p-4 bg-muted/30 rounded-lg border border-border">
                    {/* This is a simplified visualization of ecosystem interactions */}
                    <div className="flex flex-col items-center">
                      {/* Central Bank Node */}
                      <div className="relative mb-8">
                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-background">
                          <Landmark className="h-10 w-10 text-blue-800" />
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border">
                          <span className="text-sm font-medium">
                            Central Bank
                          </span>
                        </div>
                      </div>

                      {/* Connection Lines */}
                      <div className="w-0.5 h-8 bg-muted-foreground/30"></div>

                      {/* Middle Layer */}
                      <div className="flex justify-center gap-16 mb-8">
                        {/* Commercial Banks */}
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center border-4 border-background">
                            <Building className="h-8 w-8 text-green-800" />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border">
                            <span className="text-sm font-medium">Banks</span>
                          </div>
                        </div>

                        {/* Government */}
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border-4 border-background">
                            <Building className="h-8 w-8 text-slate-800" />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border">
                            <span className="text-sm font-medium">
                              Government
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Connection Lines */}
                      <div className="w-full flex justify-center mb-8">
                        <div className="w-1/3 flex justify-center">
                          <div className="w-0.5 h-8 bg-muted-foreground/30"></div>
                        </div>
                        <div className="w-1/3 flex justify-center">
                          <div className="w-0.5 h-8 bg-muted-foreground/30"></div>
                        </div>
                      </div>

                      {/* Bottom Layer - Users */}
                      <div className="flex justify-center gap-16">
                        {/* Individual Users */}
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center border-4 border-background">
                            <Users className="h-8 w-8 text-amber-800" />
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-3 py-1 rounded-full border border-border">
                            <span className="text-sm font-medium">
                              End Users
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute top-4 right-4 bg-card p-3 rounded-lg border border-border shadow-sm">
                      <h4 className="text-xs font-medium mb-2">Legend</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                          <span className="text-xs">Primary Issuer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-100"></div>
                          <span className="text-xs">Distribution Partners</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                          <span className="text-xs">Policy Implementation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-100"></div>
                          <span className="text-xs">
                            Consumers & Businesses
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    The CBDC ecosystem facilitates a multi-layered interaction
                    model where the Central Bank issues currency that flows
                    through intermediaries to end users.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CBDCDashboard;
