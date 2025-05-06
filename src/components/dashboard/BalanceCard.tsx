import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Loader2, QrCode, Shield, BadgeCheck, Wallet, Check } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

import { useAuth } from '@/context/AuthContext';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import QRCodeScannerComponent from '../transactions/QRCodeScanner';

interface BalanceCardProps {
    balance?: number;
    currency?: string;
}

const BalanceCard = ({ balance: initialBalance = 0, currency = 'CBDC' }: BalanceCardProps) => {
    const [currentBalance, setCurrentBalance] = useState(initialBalance);
    const { currentUser, setCurrentUser } = useAuth();
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // const { toast } = useToast();

    const [showSendDialog, setShowSendDialog] = useState(false);
    const [isQRModalOpen, setQRModalOpen] = useState(false);
    const [showLoadingDialog, setShowLoadingDialog] = useState(false);
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showDetailsBankNote, setShowDetailsBankNote] = useState(false);
    const [successfulRedeem, setSuccessfulRedeem] = useState(false);
    const [qrData, setQRData] = useState(null);

    const [sendRecipient, setSendRecipient] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [sendNote, setSendNote] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [transaction, setTransaction] = useState(null);
    const [recipientError, setRecipientError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [showFailureDialog, setShowFailureDialog] = useState(false);

    useEffect(() => {
        setCurrentBalance(initialBalance);
    });

    // useEffect(() => {
    //     setSendRecipient('');
    //     setSendAmount('');
    //     setRecipientError('');
    //     setAmountError('');
    //     setGeneralError('');
    //     setIsSending(false);
    // }, [showSendDialog]);

    // Handle QR Code Data
    async function handleDataFromQR(data: string) {
        setShowLoadingDialog(true);
        await sleep(2000);
        setShowLoadingDialog(false);
        console.log('QR Code data:', data);
        if (data.includes('https://')) {
            setShowDetailsBankNote(true);
        } else {
            setSuccessfulRedeem(true);
            addToBalance(data);
        }

        setQRModalOpen(false);
    }

    async function addToBalance(data: string) {
        const valueToAdd = 20;

        const { error: receiverError } = await supabase
            .from('Users')
            .update({ balance: currentUser.balance + valueToAdd })
            .eq('id', currentUser.id);

        if (receiverError) {
            console.error('Error updating balance:', receiverError);
            toast.error('Failed to add balance.');
            return;
        }
        const updatedUser = { ...currentUser, balance: currentUser.balance + valueToAdd };
        setCurrentBalance(currentUser.balance + valueToAdd);
        setCurrentUser(updatedUser);
        const { data: tokenData, error: fetchError } = await supabase.from('TokenSupply').select('bank_notes_redeemed').eq('id', 1).single();

        if (fetchError) {
            console.error(fetchError);
            return;
        }

        // Step 2: Update with new value
        const newValue = tokenData.bank_notes_redeemed + valueToAdd;

        const { error: updateError } = await supabase.from('TokenSupply').update({ bank_notes_redeemed: newValue }).eq('id', 1);

        if (updateError) {
            console.error(updateError);
        }
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount) + ' CBDC';

    const handleSendToken = async () => {
        setShowLoadingDialog(true);
        setIsSending(true);
        setRecipientError('');
        setAmountError('');
        setGeneralError('');
        setTransactionSuccess(false);

        try {
            const parsedAmount = parseFloat(sendAmount);

            if (!sendRecipient) {
                setRecipientError('Recipient ID is required.');
                throw new Error('Validation failed');
            }

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                setAmountError('Please enter a valid positive amount.');
                throw new Error('Validation failed');
            }

            const { data: sender, error: senderError } = await supabase.from('Users').select('*').eq('id', currentUser?.id).single();

            if (senderError || !sender) throw new Error('Sender not found.');

            const { data: receiver, error: receiverError } = await supabase.from('Users').select('*').eq('id', sendRecipient).single();

            if (receiverError || !receiver) {
                setRecipientError('Recipient not found.');
                throw new Error('Recipient does not exist');
            }

            if (sender.id === receiver.id) {
                setRecipientError('You cannot send funds to yourself.');
                throw new Error('Invalid recipient');
            }

            if (sender.role === 'user' || sender.role === 'commercial_bank') {
                const { data: balanceCheck, error: balanceError } = await supabase.from('Users').select('balance').eq('id', sender.id).single();

                if (balanceError || !balanceCheck) throw new Error('Balance fetch error');

                if (balanceCheck.balance < parsedAmount) {
                    setAmountError('Insufficient funds.');
                    throw new Error('Insufficient balance');
                }

                await supabase
                    .from('Users')
                    .update({ balance: sender.balance - parsedAmount })
                    .eq('id', sender.id);
                await supabase
                    .from('Users')
                    .update({ balance: receiver.balance + parsedAmount })
                    .eq('id', receiver.id);

                setCurrentBalance(sender.balance - parsedAmount);
                setCurrentUser({ ...currentUser, balance: sender.balance - parsedAmount });
            }

            if (sender.role === 'central_bank') {
                const { data: supply, error: supplyError } = await supabase.from('TokenSupply').select('*').single();
                if (supplyError || !supply) throw new Error('TokenSupply fetch failed.');

                const available = supply.total_minted - supply.distributed - supply.bank_notes_issued;
                if (available < parsedAmount) {
                    setAmountError('Insufficient central bank funds.');
                    throw new Error('Central bank insufficient');
                }

                await supabase
                    .from('TokenSupply')
                    .update({ distributed: supply.distributed + parsedAmount })
                    .eq('id', 1);
                await supabase
                    .from('Users')
                    .update({ balance: receiver.balance + parsedAmount })
                    .eq('id', receiver.id);

                setCurrentBalance(available - parsedAmount);
            }

            const {data: transaction, error: transactionError} = await supabase.from('Transactions').insert([
                {
                    sender: sender.id,
                    receiver: receiver.id,
                    amount: parsedAmount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    type: `${sender.role}_to_${receiver.role}`,
                },
            ]).select();

            setTransactionId(transaction[0].id);
            setTransaction(transaction[0]);

            setTransactionSuccess(true);
            setShowSendDialog(false);
            await sleep(200);
            setShowSuccessDialog(true);
        } catch (error: any) {
            console.error('Transaction failed:', error.message);
            setTransactionSuccess(false);
            setShowSendDialog(false);
            await sleep(200);
            setShowFailureDialog(true);
            if (!recipientError && !amountError) setGeneralError(error.message);
        } finally {
            await sleep(1000);
            setIsSending(false);
            setShowLoadingDialog(false);
        }
    };

    const trimId = (id) => {
        return id ? `${id.slice(0, 6)}...${id.slice(-4)}` : 'N/A';
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Card className="w-full sm:w-[380px] h-auto sm:h-[220px] bg-card overflow-hidden">
                <CardHeader className="pb-2 p-3 sm:p-6">
                    <CardTitle className="text-lg flex justify-between items-center">
                        <span>Total Balance</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                    <motion.div className="text-2xl sm:text-3xl font-bold mb-4">{formatCurrency(currentBalance)}</motion.div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 p-3 sm:p-6">
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setShowSendDialog(true)}>
                        <Send className="mr-1" size={16} /> Send
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm" onClick={() => setQRModalOpen(true)}>
                        <QrCode className="mr-1" size={16} /> Scan QR
                    </Button>
                </CardFooter>
            </Card>
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Send Money</DialogTitle>
                        <DialogDescription>Transfer CBDC to another account securely</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <Input id="recipient" placeholder="Enter recipient Id" value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="flex gap-2">
                                <Input id="amount" type="text" placeholder="0.00" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
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
                            <Textarea id="note" placeholder="Add a note for this transaction" value={sendNote} onChange={(e) => setSendNote(e.target.value)} />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Secure Transaction</p>
                                    <p className="text-xs text-muted-foreground mt-1">All transactions are encrypted and protected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendToken} disabled={!sendRecipient || !sendAmount}>
                            Send Money
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Receive Money</DialogTitle>
                        <DialogDescription>Share your QR code or wallet address to receive payments</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                            <img
                                src={qrImageUrl}
                                alt="Payment QR Code"
                                className={`
                    ${qrSize === 'small' ? 'w-32 h-32' : ''}
                    ${qrSize === 'medium' ? 'w-48 h-48' : ''}
                    ${qrSize === 'large' ? 'w-64 h-64' : ''}
                  `}
                            />
                        </div>
                        <div className="bg-muted p-3 rounded-md text-sm">
                            <p className="font-medium">
                                Account ID: <span className="font-normal">{profileData.accountId}</span>
                            </p>
                            <p className="font-medium">
                                Account Name: <span className="font-normal">{profileData.name}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="receive-amount">Requested Amount (Optional)</Label>
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
                            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
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
            </Dialog> */}

            <Dialog open={showLoadingDialog} onOpenChange={setShowLoadingDialog}>
                <DialogContent className="sm:max-w-[340px] p-6 text-center flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">Processing Transaction</h2>
                    <p className="text-sm text-muted-foreground">Please wait while your transaction is being completed.</p>
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
                        <p className="text-center text-muted-foreground">Your transaction has been successfully processed.</p>
                        <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-medium">{sendAmount || '0'} CBDC</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Recipient:</span>
                                <span className="font-medium">{trimId(sendRecipient)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-medium">
                                   {trimId(transactionId) || 'N/A'} 
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{transaction?.created_at ? formatDate(transaction.created_at) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showFailureDialog} onOpenChange={setShowFailureDialog}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Transaction Failed</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">❌</div>
                        <h3 className="text-xl font-semibold text-red-600">Oops!</h3>
                        <p className="text-center text-muted-foreground">
                            The transaction failed. {amountError || recipientError || generalError || 'Please try again later.'}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowFailureDialog(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* QR Code Scanner Modal */}
            <Dialog open={isQRModalOpen} onOpenChange={setQRModalOpen}>
                <DialogContent>
                    <QRCodeScannerComponent onScanSuccess={handleDataFromQR} onCancel={() => setQRModalOpen(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={showDetailsBankNote} onOpenChange={setShowDetailsBankNote}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>DUAL Details</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">{/* You can put an icon here if needed */}</div>
                        <h3 className="text-xl font-semibold">DUAL</h3>
                        {/* <p className="text-center text-muted-foreground">Details of the DUAL.</p> */}
                        <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-medium">20 DUALS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Owner:</span>
                                <span className="font-medium">Central Bank</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowDetailsBankNote(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={successfulRedeem} onOpenChange={setSuccessfulRedeem}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Redeem Successful</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                            <BadgeCheck className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold">20 DUAL Deposited</h3>
                        <p className="text-center text-muted-foreground">
                            The bank note has been successfully redeemed and the amount has been added to your wallet.
                        </p>
                        <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                            <div className="flex items-center space-x-2">
                                <Wallet className="text-muted-foreground h-5 w-5" />
                                <span className="font-medium">Wallet credited with 20 DUAL</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Time:</span>
                                <span>{new Date().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Source:</span>
                                <span>Central Bank</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setSuccessfulRedeem(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BalanceCard;
