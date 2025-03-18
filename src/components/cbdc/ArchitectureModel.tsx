import React from "react";
import { motion } from "framer-motion";
import {
  Database,
  Landmark,
  Building,
  Users,
  ArrowDown,
  ArrowRight,
  Shield,
  Layers,
  Server,
  FileCode,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArchitectureModelProps {
  showCard?: boolean;
  isAnimated?: boolean;
}

const ArchitectureModel = ({
  showCard = true,
  isAnimated = true,
}: ArchitectureModelProps) => {
  const architectureContent = (
    <div className="space-y-8">
      {/* Two-Tier Architecture Diagram */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Tier Architecture Model</h3>
        <div className="relative p-6 bg-muted/30 rounded-lg border border-border">
          {/* This is a visualization of the two-tier architecture */}
          <div className="flex flex-col items-center">
            {/* Tier 1: Central Bank */}
            <motion.div
              initial={isAnimated ? { opacity: 0, y: -20 } : false}
              animate={isAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.5 }}
              className="relative mb-12"
            >
              <div className="text-center mb-2">
                <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Tier 1
                </Badge>
                <h4 className="font-medium">Central Bank</h4>
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <Landmark className="h-8 w-8 text-blue-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">Token Issuer</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <Database className="h-8 w-8 text-blue-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    Master Ledger
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                    <Shield className="h-8 w-8 text-blue-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    Security Layer
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Connection Arrow */}
            <motion.div
              initial={isAnimated ? { opacity: 0 } : false}
              animate={isAnimated ? { opacity: 1 } : false}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="h-12 flex justify-center items-center"
            >
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>

            {/* Tier 2: Commercial Banks */}
            <motion.div
              initial={isAnimated ? { opacity: 0, y: 20 } : false}
              animate={isAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative mb-12"
            >
              <div className="text-center mb-2">
                <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">
                  Tier 2
                </Badge>
                <h4 className="font-medium">
                  Commercial Banks & Payment Providers
                </h4>
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                    <Building className="h-8 w-8 text-green-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    Token Distributors
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                    <Server className="h-8 w-8 text-green-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">
                    Wallet Providers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                    <Layers className="h-8 w-8 text-green-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">API Services</span>
                </div>
              </div>
            </motion.div>

            {/* Connection Arrow */}
            <motion.div
              initial={isAnimated ? { opacity: 0 } : false}
              animate={isAnimated ? { opacity: 1 } : false}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="h-12 flex justify-center items-center"
            >
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </motion.div>

            {/* End Users */}
            <motion.div
              initial={isAnimated ? { opacity: 0, y: 20 } : false}
              animate={isAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="relative"
            >
              <div className="text-center mb-2">
                <Badge className="mb-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                  End Users
                </Badge>
                <h4 className="font-medium">Consumers & Businesses</h4>
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                    <Users className="h-8 w-8 text-amber-800" />
                  </div>
                  <span className="text-xs mt-1 text-center">CBDC Users</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={isAnimated ? { opacity: 0, x: -20 } : false}
            animate={isAnimated ? { opacity: 1, x: 0 } : false}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-muted/30 p-4 rounded-lg border border-border"
          >
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-primary" />
              Simulated Blockchain Integration
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>
                  Simulated transaction hashes and block numbers for authentic
                  experience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>
                  Metadata generation including timestamps and confirmation
                  counts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>
                  Designed for seamless transition to live blockchain networks
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={isAnimated ? { opacity: 0, x: 20 } : false}
            animate={isAnimated ? { opacity: 1, x: 0 } : false}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-muted/30 p-4 rounded-lg border border-border"
          >
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <FileCode className="h-4 w-4 text-primary" />
              System Integration
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>
                  Modular architecture supporting multiple blockchain protocols
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>
                  API-based integration with existing financial systems
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground mt-1">•</span>
                <span>Compliance monitoring and reporting capabilities</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Key Benefits of Two-Tier Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={isAnimated ? { opacity: 0, y: 20 } : false}
            animate={isAnimated ? { opacity: 1, y: 0 } : false}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-blue-50 p-4 rounded-lg border border-blue-100"
          >
            <h4 className="font-medium text-blue-800 mb-2">
              Centralized Control
            </h4>
            <p className="text-sm text-blue-700">
              Central bank maintains control over monetary policy while
              delegating distribution
            </p>
          </motion.div>

          <motion.div
            initial={isAnimated ? { opacity: 0, y: 20 } : false}
            animate={isAnimated ? { opacity: 1, y: 0 } : false}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-green-50 p-4 rounded-lg border border-green-100"
          >
            <h4 className="font-medium text-green-800 mb-2">
              Efficient Distribution
            </h4>
            <p className="text-sm text-green-700">
              Leverages existing banking infrastructure for faster adoption and
              distribution
            </p>
          </motion.div>

          <motion.div
            initial={isAnimated ? { opacity: 0, y: 20 } : false}
            animate={isAnimated ? { opacity: 1, y: 0 } : false}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-amber-50 p-4 rounded-lg border border-amber-100"
          >
            <h4 className="font-medium text-amber-800 mb-2">
              System Resilience
            </h4>
            <p className="text-sm text-amber-700">
              Distributed architecture provides redundancy and improved system
              reliability
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );

  if (!showCard) {
    return architectureContent;
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge className="w-fit mb-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
              System Architecture
            </Badge>
            <CardTitle className="text-2xl">CBDC Two-Tier Model</CardTitle>
            <CardDescription>
              The architectural framework for secure and efficient token
              distribution
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">{architectureContent}</CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <p>
          This two-tier architecture ensures central bank control while
          leveraging existing financial infrastructure for distribution.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ArchitectureModel;
