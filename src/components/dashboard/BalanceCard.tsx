import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Send, Loader2, QrCode, Shield } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import QRCodeScanner from '../transactions/QRCodeScanner';
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
    // const { toast } = useToast();

    const [showSendDialog, setShowSendDialog] = useState(false);
    const [isQRModalOpen, setQRModalOpen] = useState(false);
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [qrData, setQRData] = useState(null);

    const [sendRecipient, setSendRecipient] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [sendNote, setSendNote] = useState('');
    const [recipientError, setRecipientError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setCurrentBalance(initialBalance);
    }, [initialBalance]);

    useEffect(() => {
        setSendRecipient('');
        setSendAmount('');
        setRecipientError('');
        setAmountError('');
        setGeneralError('');
        setIsSending(false);
    }, [showSendDialog]);

    // Handle QR Code Data
    function handleDataFromQR(data: string) {
        console.log('QR Code data:', data);
        addToBalance(data);
        setQRModalOpen(false);
    }
    function addToBalance(data: string) {
        const valueToAdd = 20;
        const parsedData = parseFloat(data);
        setCurrentBalance((prevBalance) => prevBalance + valueToAdd);
    }

    const handleSendToken = async () => {
        setIsSending(true);
        setRecipientError('');
        setAmountError('');
        setGeneralError('');

        try {
            const parsedAmount = parseFloat(String(sendAmount));

            if (!sendRecipient) {
                setRecipientError('Recipient username is required.');
                throw new Error('Validation failed');
            }
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                setAmountError('Please enter a valid positive amount.');
                throw new Error('Validation failed');
            }

            const { data: sender, error: senderError } = await supabase.from('Users').select('*').eq('id', currentUser?.id).single();

            const { data: receiver, error: receiverError } = await supabase.from('Users').select('*').eq('id', sendRecipient).single();

            if (senderError || !sender) {
                setGeneralError('Your user data could not be found.');
                throw senderError || new Error('Sender fetch failed');
            }

            if (receiverError || !receiver) {
                setRecipientError('Recipient username not found.');
                throw receiverError || new Error('Receiver fetch failed');
            }

            if (sender.id === receiver.id) {
                setRecipientError('You cannot send funds to yourself.');
                throw new Error('Self-send attempt');
            }

            if (sender.role === 'user' || sender.role === 'commercial_bank') {
                if (sender.balance < parsedAmount) {
                    setAmountError('Insufficient funds.');
                    throw new Error('Insufficient funds');
                }

                const { error: senderUpdateError } = await supabase
                    .from('Users')
                    .update({ balance: sender.balance - parsedAmount })
                    .eq('id', sender.id);

                const { error: receiverUpdateError } = await supabase
                    .from('Users')
                    .update({ balance: receiver.balance + parsedAmount })
                    .eq('id', receiver.id);

                if (senderUpdateError || receiverUpdateError) {
                    throw new Error('Balance update failed.');
                }

                const updatedUser = { ...currentUser, balance: currentUser.balance - parsedAmount };
                setCurrentUser(updatedUser);
                setCurrentBalance(sender.balance - parsedAmount);
            }

            if (sender.role === 'central_bank') {
                const { data: tokenData, error: receiverError } = await supabase.from('TokenSupply').select('*').eq('id', 1);

                const tokenMinted = tokenData[0].total_minted;
                const tokenInCirculation = tokenData[0].in_circulation;
                const tokenBalance = tokenMinted - tokenInCirculation;

                if (tokenBalance < parsedAmount) {
                    setAmountError('Insufficient funds.');
                    throw new Error('Insufficient funds');
                }
                const { error: senderUpdateError } = await supabase
                    .from('TokenSupply')
                    .update({ in_circulation: tokenInCirculation + parsedAmount })
                    .eq('id', 1);
                const { error: receiverUpdateError } = await supabase
                    .from('Users')
                    .update({ balance: receiver.balance + parsedAmount })
                    .eq('id', receiver.id);
                if (senderUpdateError || receiverUpdateError) {
                    throw new Error('Balance update failed.');
                }

                setCurrentBalance(tokenBalance - parsedAmount);
            }
            const type = sender.role + '_to_' + receiver.role;

            const { error: transactionError } = await supabase.from('Transactions').insert([
                {
                    sender: sender.id,
                    receiver: receiver.id,
                    amount: parsedAmount,
                    timestamp: new Date().toISOString(),
                    status: 'completed',
                    type: type,
                },
            ]);

            setCurrentUser({ ...currentUser });

            if (transactionError) {
                throw new Error('Transaction logging failed.');
            }

            toast.success('Transaction Successful!', {
                description: 'Your transaction has been completed successfully.',
            });
            setShowSendDialog(false);
        } catch (error: any) {
            console.error('Send transaction failed:', error);
            if (!recipientError && !amountError && !generalError) {
                setGeneralError(`An unexpected error occurred: ${error.message}`);
            }
        } finally {
            setIsSending(false);
        }
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
                    <motion.div className="text-2xl sm:text-3xl font-bold mb-4">{currentBalance.toFixed(2)}</motion.div>
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

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Transaction Confirmed</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                            {/* <Check className="h-8 w-8 text-green-600" /> */}
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
                                <span className="font-medium">{sendRecipient}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-medium">
                                    TX-
                                    {Math.floor(Math.random() * 1000000)
                                        .toString()
                                        .padStart(6, '0')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{new Date().toLocaleString()}</span>
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

            {/* QR Code Scanner Modal */}
            <Dialog open={isQRModalOpen} onOpenChange={setQRModalOpen}>
                <DialogContent>
                    <QRCodeScannerComponent onScanSuccess={handleDataFromQR} onCancel={() => setQRModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BalanceCard;
