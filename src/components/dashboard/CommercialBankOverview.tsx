import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building, Users, Send, QrCode, Shield } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import QRCodeScannerComponent from '../transactions/QRCodeScanner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

const CommercialBankOverview: React.FC = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [clientCount, setClientCount] = useState<number>(0);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [showScanDialog, setShowScanDialog] = useState(false);
    const [sendRecipient, setSendRecipient] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [sendNote, setSendNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Placeholder demo client count; replace with real Supabase query
    useEffect(() => {
        async function fetchClientCount() {
            setClientCount(1250);
        }
        fetchClientCount();
    }, [currentUser?.bankId]);

    const balance = currentUser?.balance ?? 0;
    const activeToday = Math.floor(clientCount * 0.65);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);

    // -- Send Funds Handler --
    const handleSendSubmit = async () => {
        setIsProcessing(true);
        try {
            const amount = parseFloat(sendAmount);
            if (!sendRecipient || isNaN(amount) || amount <= 0) {
                toast.error('Please enter a valid recipient and amount.');
                return;
            }
            // Fetch sender & receiver
            const { data: sender, error: senderErr } = await supabase.from('Users').select('*').eq('id', currentUser.id).single();
            const { data: receiver, error: receiverErr } = await supabase.from('Users').select('*').eq('id', sendRecipient).single();
            if (senderErr || receiverErr || !sender || !receiver) {
                toast.error('User lookup failed.');
                return;
            }
            if (sender.balance < amount) {
                toast.error('Insufficient funds.');
                return;
            }
            // Update balances
            const { error: e1 } = await supabase
                .from('Users')
                .update({ balance: sender.balance - amount })
                .eq('id', sender.id);
            const { error: e2 } = await supabase
                .from('Users')
                .update({ balance: receiver.balance + amount })
                .eq('id', receiver.id);
            if (e1 || e2) {
                toast.error('Balance update failed.');
                return;
            }
            // Log transaction
            const { error: txErr } = await supabase.from('Transactions').insert([
                {
                    sender: sender.id,
                    receiver: receiver.id,
                    amount,
                    status: 'completed',
                    timestamp: new Date().toISOString(),
                    type: `${sender.role}_to_${receiver.role}`,
                    note: sendNote,
                },
            ]);
            if (txErr) {
                toast.error('Transaction logging failed.');
                return;
            }
            // Update context
            setCurrentUser({ ...currentUser, balance: sender.balance - amount });
            toast.success('Transaction successful!');
            setShowSendDialog(false);
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };

    // -- Scan QR Handler --
    const handleScanSuccess = async (data: string) => {
        const value = parseFloat(data);
        if (isNaN(value)) {
            toast.error('Invalid QR data.');
            return;
        }
        setShowScanDialog(false);
        try {
            const newBal = balance + value;
            const { error } = await supabase.from('Users').update({ balance: newBal }).eq('id', currentUser.id);
            if (error) {
                toast.error('Redemption failed.');
                return;
            }
            setCurrentUser({ ...currentUser, balance: newBal });
            toast.success(`Redeemed ${formatCurrency(value)}!`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            {/* Main Overview Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[1200px]">
                <Card className="w-full">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6">
                        <div>
                            <CardTitle className="text-xl font-bold">COMMERCIAL BANK DASHBOARD</CardTitle>
                            <CardDescription className="text-sm uppercase text-muted-foreground">
                                {(currentUser?.bankName || 'BANK').toUpperCase()}
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Commercial Bank Portal</span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Balance Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-end space-x-2">
                                    <span className="text-2xl sm:text-3xl font-bold">{formatCurrency(balance)}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-4">
                                    <Button variant="outline" size="sm" className="text-xs sm:text-sm px-3 py-1.5" onClick={() => setShowSendDialog(true)}>
                                        <Send className="mr-1 h-4 w-4" /> Send
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs sm:text-sm px-3 py-1.5" onClick={() => setShowScanDialog(true)}>
                                        <QrCode className="mr-1 h-4 w-4" /> Scan
                                    </Button>
                                </div>
                            </div>

                            {/* Client Information */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-muted-foreground">Client Information</h3>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Clients</p>
                                            <p className="text-xl sm:text-2xl font-bold">{clientCount}</p>
                                        </div>
                                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                                            demo
                                        </span>
                                    </div>
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Active Today</p>
                                            <p className="text-xl sm:text-2xl font-bold">{activeToday}</p>
                                        </div>
                                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                                            demo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="border-t p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between w-full text-xs sm:text-sm gap-2">
                            <span className="text-muted-foreground">Last updated: {new Date().toLocaleString()}</span>
                            <button className="text-primary hover:underline">View detailed report</button>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>

            {/* Send Funds Dialog */}
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Funds</DialogTitle>
                        <DialogDescription>Enter recipient, amount, and optional note</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient ID</Label>
                            <Input id="recipient" value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)} placeholder="User ID" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Textarea id="note" value={sendNote} onChange={(e) => setSendNote(e.target.value)} placeholder="Add a note for this transaction" />
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                            <Shield className="h-4 w-4" />
                            <span>All transactions are encrypted and protected</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendSubmit} disabled={isProcessing || !sendRecipient || !sendAmount || isNaN(parseFloat(sendAmount))}>
                            {isProcessing ? 'Sending...' : 'Send'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Scan QR Dialog */}
            <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Scan QR Code</DialogTitle>
                        <DialogDescription>Scan a code to redeem funds</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <QRCodeScannerComponent onScanSuccess={handleScanSuccess} onCancel={() => setShowScanDialog(false)} />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowScanDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CommercialBankOverview;
