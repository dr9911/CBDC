import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserDocumentation = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Management Documentation</CardTitle>
        <CardDescription>
          How to manage users and access control in the DUAL Platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="adding">Adding Users</TabsTrigger>
            <TabsTrigger value="roles">User Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">System Overview</h3>
              <p>
                The DUAL Platform uses a file-based authentication system to
                manage users and their access levels. User credentials and
                information are stored in a JSON file located at{" "}
                <code>src/data/users.json</code>.
              </p>

              <h4 className="text-md font-medium mt-4">Key Features:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Three user roles with different access levels</li>
                <li>File-based storage of user credentials</li>
                <li>Password hashing for security</li>
                <li>Session management with timeout</li>
                <li>Role-based access control</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="adding" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adding New Users</h3>
              <p>
                New users can be added through the User Management interface or
                by directly editing the users.json file.
              </p>

              <h4 className="text-md font-medium mt-4">
                Through the Interface:
              </h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Navigate to the User Management page (requires Central Bank
                  access)
                </li>
                <li>Click the "Add User" button</li>
                <li>Fill in the required information</li>
                <li>Select the appropriate role</li>
                <li>Click "Add User" to save</li>
              </ol>

              <h4 className="text-md font-medium mt-4">
                Editing the JSON File:
              </h4>
              <p>
                To manually add a user to the JSON file, add a new object with
                the following structure:
              </p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
                {`{
  "id": "unique-id",
  "username": "username",
  "passwordHash": "hashed_password",
  "role": "user", // or "commercial_bank" or "central_bank"
  "name": "User's Full Name",
  "email": "user@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=username"
}`}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                User Roles and Permissions
              </h3>

              <h4 className="text-md font-medium">Central Bank</h4>
              <p>
                Central Banks have the highest level of access and can perform
                all actions in the system.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mint new DUAL currency</li>
                <li>Manage all users</li>
                <li>View all transactions</li>
                <li>Configure system parameters</li>
                <li>Access all dashboards and reports</li>
              </ul>

              <h4 className="text-md font-medium mt-4">Commercial Bank</h4>
              <p>
                Commercial Banks have intermediate access and can manage their
                customers and transactions.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View and manage customer accounts</li>
                <li>Process transactions</li>
                <li>View transaction history</li>
                <li>Generate reports</li>
                <li>Cannot mint new currency</li>
              </ul>

              <h4 className="text-md font-medium mt-4">User</h4>
              <p>
                Regular users have basic access to manage their own accounts and
                transactions.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View personal account information</li>
                <li>Send and receive DUAL currency</li>
                <li>View personal transaction history</li>
                <li>Update personal profile</li>
                <li>Cannot access administrative functions</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserDocumentation;
