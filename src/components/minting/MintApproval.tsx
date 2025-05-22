import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '../layout/DashboardLayout';
import { sendOtpToEmail, verifyOtp } from '@/utils/otpService';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, CheckCircle2, Key, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';

interface MintApprovalProps {
    confirmDialogOpen?: boolean;
    notification?: any;
}

const MintApproval = ({ confirmDialogOpen: propConfirmDialogOpen, notification: propNotification }: MintApprovalProps) => {
    const { currentUser } = useAuth();
    // const [supply, setSupply] = useState<number>(0);
    const [mintEvents, setMintEvents] = useState<any[]>([]);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const location = useLocation();
    const routeState = location.state as {
        confirmDialogOpen?: boolean;
        notification?: any;
    } | null;

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(propConfirmDialogOpen ?? routeState?.confirmDialogOpen ?? false);

    const notification = propNotification ?? routeState?.notification;

    // useEffect(() => {
    //     const fetchSupply = async () => {
    //         console.log('Notification:', notification);
    //         console.log('Fetching supply from database...');
    //         const { data, error } = await supabase.from('TokenSupply').select('total_minted');

    //         if (error) {
    //             console.error('Error fetching supply:', error);
    //             return;
    //         }

    //         if (data) {
    //             setSupply(data[0].total_minted || 0);
    //         }
    //     };

    //     fetchSupply();
    // }, []);
    useEffect(() => {
        // ✅ 1️⃣ Start loader
        setLoading(true);

        // ✅ 2️⃣ Define the async function
        const fetchMintingEvents = async () => {
            try {
                const { data, error } = await supabase.from('CentralBankEvents').select(`
                    id,
                    created_at,
                    document_date,
                    amount,
                    minted_by,
                    status,
                    approved_at,
                    note,
                    type,
                    minted_by_user:minted_by (
                        name
                    )
                `);

                // ✅ 3️⃣ Error handling
                if (error) {
                    console.error('❌ Error fetching minting events:', error.message);
                } else {
                    console.log('✅ Fetched minting events:', data);
                    setMintEvents(data);

                    // ✅ 4️⃣ If there's a notification, find the event and set it
                    if (confirmDialogOpen && notification) {
                        console.log('🔔 Notification Detected:', notification.mint_event_id);
                        const event = data.find((event) => event.id === notification.mint_event_id);
                        if (event) {
                            setCurrentEvent(event);
                            console.log('✅ Current Event:', event);
                        }
                    }
                }
            } catch (e) {
                console.error('🚨 Unexpected error during fetch:', e.message);
            } finally {
                // ✅ 5️⃣ Stop loader
                setLoading(false);
            }
        };

        // ✅ 6️⃣ Execute the fetch
        fetchMintingEvents();
    }, [confirmDialogOpen, notification]);

    // useEffect(() => {

    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(confirmDialogOpen);
    const [showMfaDialog, setShowMfaDialog] = useState<boolean>(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
    const [mfaCode, setMfaCode] = useState<string>('');
    const formatDate = (dateString: string) => {
        try {
            // Example format: Mar 31, 2025, 12:00 PM
            return format(new Date(dateString), 'MMM dd, yyyy, hh:mm a');
        } catch (e) {
            console.error('Failed to format date:', dateString, e);
            return 'Invalid Date';
        }
    };
    const handleSubmit = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmMinting = async () => {
        try {
            setShowConfirmDialog(false);
            setShowMfaDialog(true);

            // 🔄 Send OTP to current user email
            if (currentUser?.email) {
                await sendOtpToEmail(currentUser.email);
                console.log(`✅ OTP sent to ${currentUser.email}`);
            } else {
                console.error('❌ User email not found for OTP');
                alert('User email not found. Cannot send OTP.');
                setShowMfaDialog(false);
                return;
            }
        } catch (error) {
            console.error('❌ Error during OTP sending:', error.message);
            alert('Failed to send OTP. Please try again.');
            setShowMfaDialog(false);
        }
    };

    const handleVerifyMfa = async () => {
        setIsVerifying(true);
        setErrorMessage('');
        try {
            // 🔄 Verify OTP first
            await verifyOtp(currentUser.email, mfaCode);
            console.log('✅ OTP Verified successfully');

            setShowMfaDialog(false);

            // 🔍 1️⃣ Insert into MintApprovals
            const { data: approvalData, error: approvalError } = await supabase.from('MintApprovals').insert({
                event_id: currentEvent?.id,
                user_id: currentUser?.id,
                approved_at: new Date(),
            });

            if (approvalError) {
                console.error('❌ Error approving minting request:', approvalError.message);
                // alert('Minting approval failed. Please try again.');
                return;
            }
            console.log('✅ Minting request approved:', approvalData);

            // 🔍 2️⃣ Count the total number of approvals
            const { count, error: countError } = await supabase.from('MintApprovals').select('*', { count: 'exact' }).eq('event_id', currentEvent?.id);

            if (countError) {
                console.error('❌ Error fetching minting request count:', countError.message);
                // alert('Failed to retrieve approval count.');
                return;
            }

            console.log(`✅ Total approvals for event ${currentEvent?.id}:`, count);

            // 🔄 3️⃣ If count is 1 or more, update CentralBankEvents status
            if (count >= 1) {
                const { error: updateError } = await supabase
                    .from('CentralBankEvents')
                    .update({
                        status: 'approved',
                        approved_at: new Date(),
                    })
                    .eq('id', currentEvent?.id);

                if (updateError) {
                    console.error('❌ Error updating minting event:', updateError.message);
                    alert('Failed to update event status.');
                    return;
                }

                console.log('✅ Minting event updated successfully');
            }

            // 🔄 4️⃣ Update Token Supply
            const { data: supplyData, error: supplyError } = await supabase.from('TokenSupply').select('total_minted').eq('id', 1);

            if (supplyError) {
                console.error('❌ Error fetching supply:', supplyError.message);
                // alert('Failed to fetch token supply.');
                return;
            }

            if (supplyData) {
                const newSupply = supplyData[0].total_minted + currentEvent?.amount;

                const { error: updateSupplyError } = await supabase.from('TokenSupply').update({ total_minted: newSupply }).eq('id', 1);

                if (updateSupplyError) {
                    console.error('❌ Error updating supply:', updateSupplyError.message);
                    // alert('Failed to update total supply.');
                    return;
                }
                console.log(`✅ Token supply updated successfully to ${newSupply}`);
            }

            // 🔄 5️⃣ Send Notifications to All Other Central Bank Users
            const { data: users, error: usersError } = await supabase.from('Users').select('id').eq('role', 'central_bank').neq('id', currentUser?.id);

            if (usersError) {
                console.error('❌ Error fetching users:', usersError.message);
                // alert('Failed to fetch central bank users.');
                return;
            }

            console.log('✅ Users fetched for notification:', users);

            // 🔄 6️⃣ Send Notifications Asynchronously
            for (const user of users) {
                const { error: notificationError } = await supabase.from('Notifications').insert({
                    user_id: user.id,
                    message: `New minting request for ${currentEvent?.amount} tokens approved by ${currentUser?.name}`,
                    type: 'minting_approval',
                    event_id: currentEvent?.id || '',
                });

                if (notificationError) {
                    console.error(`❌ Error inserting notification for User ID ${user.id}:`, notificationError.message);
                } else {
                    console.log(`✅ Notification sent to User ID ${user.id}`);
                }
            }

            // 🎉 7️⃣ Show success dialog and reset state
            console.log('🎉 Minting supply and notifications updated successfully.');
            // alert('Minting approval and supply update successful.');
            setShowSuccessDialog(true);
        } catch (error) {
            console.error('🚨 Unexpected error during verification:', error.message);
            setErrorMessage('Invalid or expired code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);

        setMfaCode('');
    };

    const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setMfaCode(value);
    };

    const isMfaValid = mfaCode.length === 6;
    return (
        <DashboardLayout activePage="mint">
            <div className="space-y-6 px-4 sm:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Minting Events</h1>
                <p className="text-muted-foreground">View all the minting Events.</p>
                <div className="grid gap-6">
                    <Card className="w-full bg-card shadow-sm rounded-2xl border border-border">
                        {/* <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="text-lg sm:text-xl">X</CardTitle>
                <CardDescription className="text-sm">Review the approval records with their status and timestamps.</CardDescription>
            </div>
        </div>
    </CardHeader> */}

                        <CardContent className="p-4 sm:p-6 space-y-6">
                            {/* Search */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by ID or description..."
                                        className="pl-10 w-full rounded-md border border-input shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="rounded-xl border border-muted overflow-x-auto">
                                <div className="min-w-full">
                                    {/* Desktop Header */}
                                    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground sticky top-0 z-10">
                                        <div className="col-span-2">ID</div>
                                        <div className="col-span-2">Created At</div>
                                        <div className="col-span-2">Amount</div>
                                        <div className="col-span-2">Minted By</div>
                                        <div className="col-span-2">Approved At</div>
                                        <div className="col-span-1 text-center">Status</div>
                                        <div className="col-span-1">Note</div>
                                    </div>

                                    {/* Table Body */}
                                    {loading ? (
                                        <div className="p-8 text-center text-muted-foreground">Loading minting events...</div>
                                    ) : mintEvents.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">No records found.</div>
                                    ) : (
                                        <div className="divide-y">
                                            {mintEvents.map((record) => (
                                                <motion.div
                                                    key={record.id}
                                                    className="flex flex-col sm:grid sm:grid-cols-12 gap-4 p-4 text-xs sm:text-sm hover:bg-muted/30 transition-colors cursor-pointer"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    onClick={() => {
                                                        if (record.minted_by !== currentUser.id && record.type === 'mint' && record.status === 'pending') {
                                                            setCurrentEvent(record);
                                                            setShowConfirmDialog(true);
                                                        }
                                                    }}
                                                >
                                                    {/* Mobile View */}
                                                    <div className="sm:hidden space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">ID:</span>
                                                            <span className="truncate" title={record.id}>
                                                                {record.id}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Created At:</span>
                                                            <span>{formatDate(record.created_at)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Document Date:</span>
                                                            <span>{record.document_date ? formatDate(record.document_date) : '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Amount:</span>
                                                            <span>{record.amount ? Number(record.amount).toLocaleString() : '0'} CBDC</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Minted By:</span>
                                                            <span className="truncate">{record.minted_by_user?.name || '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Approved At:</span>
                                                            <span>{record.approved_at ? formatDate(record.approved_at) : '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Status:</span>
                                                            <Badge className="text-xs capitalize">{record.status}</Badge>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">Note:</span>
                                                            <span className="truncate">{record.note}</span>
                                                        </div>
                                                    </div>

                                                    {/* Desktop View */}
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.id}>
                                                        {record.id}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate">{formatDate(record.created_at)}</div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate">
                                                        {record.amount ? Number(record.amount).toLocaleString() : '0'} CBDC
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate">{record.minted_by_user?.name || '-'}</div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate">
                                                        {record.approved_at ? formatDate(record.approved_at) : '-'}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-1 text-center">
                                                        <Badge className="text-xs capitalize">{record.status}</Badge>
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-1 truncate">{record.note}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-4 border-t">
                                <div className="text-xs text-muted-foreground">{mintEvents.length} record(s) found.</div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CONFIRMATION DIALOG */}
                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Minting Operation</DialogTitle>
                                <DialogDescription>Please review the details of this minting operation before proceeding.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="bg-muted p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="font-medium">{currentEvent?.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-medium">{currentEvent?.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Note:</span>
                                        <span className="font-medium">{currentEvent?.note}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created At:</span>
                                        <span className="font-medium">{formatDate(currentEvent?.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Document Date:</span>
                                        <span className="font-medium">{formatDate(currentEvent?.document_date)}</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-amber-800 font-medium">This action requires additional verification</p>
                                        <p className="text-xs text-amber-700 mt-1">You will need to complete two-factor authentication to proceed.</p>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmMinting}>Proceed to Authentication</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* MFA DIALOG */}
                    <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Two-Factor Authentication</DialogTitle>
                                <DialogDescription>Enter the 6-digit code sent to your email to verify your identity.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Key className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">A secure 6-digit code has been sent to your email.</p>
                                    </div>
                                    <div
                                        className="flex gap-2 justify-center cursor-text"
                                        onClick={() => {
                                            document.getElementById('hidden-otp-input')?.focus();
                                        }}
                                    >
                                        {Array.from({ length: 6 }).map((_, idx) => {
                                            const isCurrent = idx === mfaCode.length; // current input index
                                            const isFilled = idx < mfaCode.length;

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`w-10 h-12 rounded-md border ${
                                                        isCurrent ? 'border-primary' : 'border-input'
                                                    } bg-background text-xl font-mono text-center flex items-center justify-center`}
                                                >
                                                    {isFilled ? mfaCode[idx] : isCurrent ? <span className="animate-pulse text-muted-foreground">|</span> : ''}
                                                </div>
                                            );
                                        })}

                                        {/* Hidden real input */}
                                        <input
                                            id="hidden-otp-input"
                                            type="text"
                                            inputMode="numeric"
                                            autoFocus
                                            maxLength={6}
                                            className="sr-only"
                                            value={mfaCode}
                                            onChange={handleMfaCodeChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowMfaDialog(false)} disabled={isVerifying}>
                                    Cancel
                                </Button>
                                <Button onClick={handleVerifyMfa} disabled={!isMfaValid || isVerifying}>
                                    {isVerifying ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Verifying...
                                        </div>
                                    ) : (
                                        'Verify & Submit'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* SUCCESS DIALOG */}
                    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Minting Request Approved</DialogTitle>
                                <DialogDescription>Your request to approve new CBDC is successful.</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-medium text-lg">Mint Id - : {currentEvent?.id}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Submitted on {new Date().toLocaleString()}</p>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Number of Tokens:</span>
                                            <span className="font-medium">
                                                {currentEvent?.amount ? Number(currentEvent?.amount).toLocaleString() : '0'} CBDC
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button onClick={handleCloseSuccess}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MintApproval;
