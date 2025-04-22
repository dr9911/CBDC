import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  Shield,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "../layout/DashboardLayout";

interface AccountsPageProps {
  userName?: string;
  userAvatar?: string;
}

const AccountsPage = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: AccountsPageProps) => {

  const { currentUser } = useAuth();
  const userBalance = currentUser?.balance || 0;
  // Sample account data
  const accounts = [
    {
      id: "acc-001",
      name: "Main CBDC Account",
      number: "DUAL-1234-5678-9012",
      balance: userBalance,
      currency: "CBDC",
      type: "Digital Currency",
      status: "active",
      lastActivity: "Today, 10:45 AM",
      created: "Jan 15, 2023",
    },
    {
      id: "acc-002",
      name: "Savings Account",
      number: "CBDC-2345-6789-0123",
      balance: 15250.5,
      currency: "CBDC",
      type: "Savings",
      status: "active",
      lastActivity: "Yesterday, 3:20 PM",
      created: "Mar 22, 2023",
    },
    {
      id: "acc-003",
      name: "Business Account",
      number: "CBDC-3456-7890-1234",
      balance: 42680.25,
      currency: "CBDC",
      type: "Business",
      status: "active",
      lastActivity: "2 days ago, 11:15 AM",
      created: "Jun 10, 2024",
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("€", "");
  };

  return (
    <DashboardLayout
      activePage="accounts"
      userName={userName}
      userAvatar={userAvatar}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Accounts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your digital currency accounts
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" /> New Account
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {account.name}
                        </CardTitle>
                        <CardDescription>{account.number}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          account.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {account.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Balance
                        </h3>
                        <div className="text-3xl font-bold">
                          {formatCurrency(account.balance)} {account.currency}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-green-500">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              Incoming
                            </span>
                          </div>
                          <div className="flex items-center text-red-500">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">
                              Outgoing
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Account Details
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium">{account.type}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Created
                            </span>
                            <span className="font-medium">
                              {account.created}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Last Activity
                            </span>
                            <span className="font-medium">
                              {account.lastActivity}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">
                              Currency
                            </span>
                            <span className="font-medium">
                              {account.currency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Statements
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Transfer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex justify-between w-full text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Updated: Today at 11:30 AM</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Shield className="h-4 w-4 mr-1" />
                        <span>Secure Account</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {accounts
              .filter((account) => account.status === "active")
              .map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {account.name}
                          </CardTitle>
                          <CardDescription>{account.number}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            account.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {account.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Balance
                          </h3>
                          <div className="text-3xl font-bold">
                            {formatCurrency(account.balance)} {account.currency}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-green-500">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                Incoming
                              </span>
                            </div>
                            <div className="flex items-center text-red-500">
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">
                                Outgoing
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Account Details
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Type
                              </span>
                              <span className="font-medium">
                                {account.type}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Created
                              </span>
                              <span className="font-medium">
                                {account.created}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Last Activity
                              </span>
                              <span className="font-medium">
                                {account.lastActivity}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">
                                Currency
                              </span>
                              <span className="font-medium">
                                {account.currency}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Quick Actions
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Statements
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Transfer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex justify-between w-full text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Updated: Today at 11:30 AM</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Shield className="h-4 w-4 mr-1" />
                          <span>Secure Account</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Inactive Accounts</h3>
              <p className="text-muted-foreground max-w-md">
                You don't have any inactive accounts at the moment. All your
                accounts are currently active.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;
