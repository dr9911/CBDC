import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Send,
  QrCode,
  CreditCard,
  ArrowRight,
  Shield,
  AlertTriangle,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define form schema for validation
const formSchema = z.object({
  transactionType: z.string(),
  recipient: z.string().min(1, { message: "Recipient is required" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  note: z.string().optional(),
});

interface TransactionFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  onScan?: () => void;
  onCancel?: () => void;
  isProcessing?: boolean;
}

const TransactionForm = ({
  onSubmit = () => {},
  onScan = () => {},
  onCancel = () => {},
  isProcessing = false,
}: TransactionFormProps) => {
  const [step, setStep] = useState(1);
  const [transactionType, setTransactionType] = useState("send");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionType: "send",
      recipient: "",
      amount: "",
      note: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(values);
    }
  };

  const handleTabChange = (value: string) => {
    setTransactionType(value);
    form.setValue("transactionType", value);
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl">Transaction</CardTitle>
        <CardDescription>
          Send or receive digital currency securely.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="send"
          value={transactionType}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send size={16} />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center gap-2">
              <QrCode size={16} />
              Receive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="Enter wallet address or username"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={onScan}
                            >
                              <QrCode size={18} />
                            </Button>
                          </div>
                          <FormDescription>
                            Enter the recipient's wallet address or scan their
                            QR code.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="0.00"
                                {...field}
                              />
                            </FormControl>
                            <Select defaultValue="dual">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dual">DUAL</SelectItem>
                                <SelectItem value="usd">USD</SelectItem>
                                <SelectItem value="eur">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormDescription>
                            Enter the amount you want to send.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Add a note for this transaction"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Add a reference or description for this transaction.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <h4 className="font-medium">Transaction Details</h4>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Recipient:
                        </span>
                        <span className="font-medium">
                          {form.watch("recipient")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">
                          {form.watch("amount")} DUAL
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-medium">0.001 DUAL</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">
                          {(
                            parseFloat(form.watch("amount") || "0") + 0.001
                          ).toFixed(3)}{" "}
                          DUAL
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="p-6 bg-muted rounded-lg flex flex-col items-center justify-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        Security Verification
                      </h3>
                      <p className="text-center text-muted-foreground">
                        Please verify this transaction to ensure security.
                      </p>

                      <div className="w-full p-4 bg-background rounded-md border border-border space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Sending to:
                          </span>
                          <span className="font-medium">
                            {form.watch("recipient")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">
                            {form.watch("amount")} DUAL
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Total with fees:
                          </span>
                          <span className="font-bold">
                            {(
                              parseFloat(form.watch("amount") || "0") + 0.001
                            ).toFixed(3)}{" "}
                            DUAL
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle size={16} />
                        <span className="text-sm">
                          Always verify transaction details
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}

                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      "Processing..."
                    ) : step < 3 ? (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Confirm Transaction"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="receive" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg space-y-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Receive Payment</h3>
              <p className="text-center text-muted-foreground">
                Share your QR code or wallet address to receive payments.
              </p>

              <div className="bg-white p-4 rounded-lg">
                {/* Placeholder for QR code */}
                <div className="h-48 w-48 bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <span className="text-muted-foreground">QR Code</span>
                </div>
              </div>

              <div className="w-full">
                <div className="flex items-center gap-2 p-3 bg-background rounded-md border border-border">
                  <CreditCard size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium truncate">
                    dual_wallet_1a2b3c4d5e6f7g8h9i0j
                  </span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="w-full space-y-3">
                <FormLabel>Request Amount (Optional)</FormLabel>
                <div className="flex gap-2">
                  <Input placeholder="0.00" />
                  <Select defaultValue="dual">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dual">DUAL</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4">
                  Generate Payment Request
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
