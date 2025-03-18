import React from "react";
import { motion } from "framer-motion";
import {
  Info,
  Shield,
  Banknote,
  RefreshCw,
  Wallet,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Database,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CBDCInfoCardProps {
  title?: string;
  description?: string;
  features?: string[];
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "minting"
    | "transactions"
    | "security"
    | "architecture";
  learnMoreLink?: string;
}

const CBDCInfoCard = ({
  title = "CBDC Overview",
  description = "Central Bank Digital Currency is the digital form of a country's fiat currency.",
  features = [
    "Government-backed digital currency",
    "Secure and traceable transactions",
    "Instant settlement",
    "Programmable money capabilities",
  ],
  icon,
  variant = "default",
  learnMoreLink = "#",
}: CBDCInfoCardProps) => {
  // Determine icon and color based on variant
  const getIconAndColor = () => {
    switch (variant) {
      case "minting":
        return {
          icon: icon || <Banknote className="h-6 w-6" />,
          color: "bg-blue-100 text-blue-800",
          hoverColor: "hover:bg-blue-200",
          borderColor: "border-blue-200",
        };
      case "transactions":
        return {
          icon: icon || <RefreshCw className="h-6 w-6" />,
          color: "bg-green-100 text-green-800",
          hoverColor: "hover:bg-green-200",
          borderColor: "border-green-200",
        };
      case "security":
        return {
          icon: icon || <Shield className="h-6 w-6" />,
          color: "bg-amber-100 text-amber-800",
          hoverColor: "hover:bg-amber-200",
          borderColor: "border-amber-200",
        };
      case "architecture":
        return {
          icon: icon || <Database className="h-6 w-6" />,
          color: "bg-purple-100 text-purple-800",
          hoverColor: "hover:bg-purple-200",
          borderColor: "border-purple-200",
        };
      default:
        return {
          icon: icon || <Info className="h-6 w-6" />,
          color: "bg-slate-100 text-slate-800",
          hoverColor: "hover:bg-slate-200",
          borderColor: "border-slate-200",
        };
    }
  };

  const {
    icon: displayIcon,
    color,
    hoverColor,
    borderColor,
  } = getIconAndColor();

  // Get feature icon based on content
  const getFeatureIcon = (feature: string) => {
    if (
      feature.toLowerCase().includes("secure") ||
      feature.toLowerCase().includes("auth")
    ) {
      return <Shield className="h-4 w-4 text-primary mt-1 shrink-0" />;
    } else if (
      feature.toLowerCase().includes("transaction") ||
      feature.toLowerCase().includes("transfer")
    ) {
      return <RefreshCw className="h-4 w-4 text-primary mt-1 shrink-0" />;
    } else if (
      feature.toLowerCase().includes("token") ||
      feature.toLowerCase().includes("currency")
    ) {
      return <Banknote className="h-4 w-4 text-primary mt-1 shrink-0" />;
    } else {
      return <Wallet className="h-4 w-4 text-primary mt-1 shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card
        className={`h-full bg-card overflow-hidden border-2 ${borderColor} transition-all duration-300 hover:shadow-md`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`p-2 rounded-full ${color} ${hoverColor} transition-colors duration-300`}
            >
              {displayIcon}
            </div>
            <Badge className={`${color} ${hoverColor}`}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
                className="flex items-start gap-2 bg-muted/30 p-2 rounded-md hover:bg-muted/50 transition-colors duration-200"
              >
                {getFeatureIcon(feature)}
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between group"
          >
            <span>Learn more</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CBDCInfoCard;
