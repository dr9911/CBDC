import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Database,
  CreditCard,
  Building,
  Users,
  Landmark,
  Shield,
  Banknote,
  RefreshCw,
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

interface MintingProcessProps {
  currentStep?: number;
  isAnimated?: boolean;
  showCard?: boolean;
}

const MintingProcess = ({
  currentStep = 0,
  isAnimated = true,
  showCard = true,
}: MintingProcessProps) => {
  const steps = [
    {
      id: 1,
      title: "Minting Request",
      description: "Central Bank initiates a request to mint CBDC",
      details: [
        "The Central Bank (CB) initiates a request to mint CBDC.",
        "Inputs: Amount to mint, purpose, authorization.",
        "Request is logged in the central ledger system.",
      ],
      icon: <Database className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-800",
      actor: "Central Bank",
      actorIcon: <Landmark className="h-4 w-4" />,
    },
    {
      id: 2,
      title: "Authorization & Approval",
      description: "Multi-signature authentication process",
      details: [
        "Multi-signature authentication by authorized officials.",
        "Verification against monetary policy guidelines.",
        "Security checks and compliance verification.",
      ],
      icon: <Shield className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-800",
      actor: "Central Bank",
      actorIcon: <Landmark className="h-4 w-4" />,
    },
    {
      id: 3,
      title: "CBDC Token Generation",
      description: "The system creates new CBDC tokens with unique identifiers",
      details: [
        "The system creates new CBDC tokens with unique identifiers.",
        "Each token contains cryptographic signatures.",
        "Tokens are recorded in the central bank's ledger.",
      ],
      icon: <Banknote className="h-5 w-5" />,
      color: "bg-green-100 text-green-800",
      actor: "Central Bank System",
      actorIcon: <Database className="h-4 w-4" />,
    },
    {
      id: 4,
      title: "Issuance to Financial Entities",
      description: "The Central Bank distributes the minted CBDC",
      details: [
        "The Central Bank distributes the minted CBDC to:",
        "Commercial banks for customer distribution",
        "Government agencies for social payments and public services",
        "Direct to users through central bank digital wallets",
      ],
      icon: <Building className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-800",
      actor: "Multiple Entities",
      actorIcon: <Users className="h-4 w-4" />,
    },
    {
      id: 5,
      title: "P2P Transfers",
      description: "CBDC Transactions Between Users",
      details: [
        "User Sends CBDC to Another User",
        "Sender enters recipient's wallet address or scans QR code",
        "Input amount and confirm transfer",
        "Transaction is verified and recorded on the ledger",
      ],
      icon: <RefreshCw className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-800",
      actor: "End Users",
      actorIcon: <Users className="h-4 w-4" />,
    },
    {
      id: 6,
      title: "Redemption",
      description: "Converting CBDC back to traditional forms",
      details: [
        "Users can exchange CBDC for physical currency at banks",
        "Commercial banks can redeem excess CBDC with the central bank",
        "Redemption requires identity verification",
      ],
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-rose-100 text-rose-800",
      actor: "Multiple Entities",
      actorIcon: <Building className="h-4 w-4" />,
    },
  ];

  const flowSummary = [
    "Central Bank Mints CBDC → Moves it to reserve wallet.",
    "CBDC Issued to Banks (Tier 2) → Following two-tier distribution model.",
    "Banks Distribute to Users → Exchange cash/bank deposits for CBDC.",
    "CBDC Transactions Occur → P2P transfers, merchant payments.",
    "Users Can Scan and Redeem the bank note in their wallet",
  ];

  const processContent = (
    <>
      {/* Process Steps */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Process Steps</h3>
          <Badge variant="outline" className="font-mono">
            {currentStep > 0
              ? `Step ${currentStep} of ${steps.length}`
              : "Not Started"}
          </Badge>
        </div>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted z-0" />

          {/* Steps */}
          <div className="space-y-8 relative z-10">
            {steps.map((step, index) => {
              const isActive = currentStep >= step.id;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={isAnimated ? { opacity: 0, y: 20 } : false}
                  animate={isAnimated ? { opacity: 1, y: 0 } : false}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                  }}
                  className={`flex gap-4 ${isActive ? "" : "opacity-60"}`}
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center z-10 ${isCurrent ? step.color : isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-semibold">{step.id}</span>
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold flex items-center gap-2">
                        <span>
                          Step {step.id}: {step.title}
                        </span>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className={`${step.color} animate-pulse`}>
                            In Progress
                          </Badge>
                        )}
                      </h4>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {step.actorIcon}
                        <span className="text-xs">{step.actor}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    <ul className="mt-2 space-y-1 bg-muted/30 p-2 rounded-md">
                      {step.details.map((detail, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* High-Level Flow Summary */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-medium">High-Level Flow Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {flowSummary.map((item, index) => (
            <motion.div
              key={index}
              initial={isAnimated ? { opacity: 0, y: 10 } : false}
              animate={isAnimated ? { opacity: 1, y: 0 } : false}
              transition={{
                delay: index * 0.1 + 0.5,
                duration: 0.3,
              }}
              className="relative"
            >
              <div className="flex items-start gap-3 bg-muted/30 p-3 rounded-md h-full">
                <div className="flex flex-col items-center">
                  <Badge className="h-6 w-6 flex items-center justify-center rounded-full p-0 mb-1">
                    {index + 1}
                  </Badge>
                  {index < flowSummary.length - 1 && (
                    <div className="h-full w-0.5 bg-muted-foreground/20 mt-1"></div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm">{item}</span>
                </div>
              </div>
              {index < flowSummary.length - 1 && (
                <div className="absolute top-6 left-3 hidden md:block">
                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 md:rotate-0" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );

  if (!showCard) {
    return processContent;
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge className="w-fit mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Process Flow
            </Badge>
            <CardTitle className="text-2xl">CBDC Minting & Issuance</CardTitle>
            <CardDescription>
              The process of creating and distributing Central Bank Digital
              Currency
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">{processContent}</CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <p>
          This visualization shows the complete lifecycle of CBDC from creation
          to circulation and redemption.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MintingProcess;
