import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '../layout/DashboardLayout';

import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, CheckCircle2, Key, Search } from 'lucide-react';
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
        const fetchMintingEvents = async () => {
            const { data, error } = await supabase.from('CentralBankEvents').select(`
                *,
                minted_by_user:minted_by (
                name
                )
            `);

            if (error) {
                console.error('Error fetching supply:', error);
                return;
            }

            if (data) {
                console.log('Fetched minting events:', data);
                setMintEvents(data);
                // setSupply(data[0].total_minted || 0);
            }

            if (confirmDialogOpen && notification) {
                // console.log('Notification:', notification);
                console.log('Current event ID:', notification.mint_event_id);
                const event = data.find((event) => event.id === notification.mint_event_id);
                setCurrentEvent(event);
                console.log('Current event:', event);
            }
        };

        fetchMintingEvents();
    }, []);

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

    const handleConfirmMinting = () => {
        setShowConfirmDialog(false);
        setShowMfaDialog(true);
    };

    const handleVerifyMfa = async () => {
        setShowMfaDialog(false);

        // here we need to approve the minting request
        const { data: approvalData, error: approvalError } = await supabase.from('MintApprovals').insert({
            event_id: currentEvent?.id,
            user_id: currentUser?.id,
            approved_at: new Date(),
        });

        if (approvalError) {
            console.error('Error approving minting request:', approvalError);
            return;
        }

        const { count, error: countError } = await supabase.from('MintApprovals').select('*', { count: 'exact' }).eq('event_id', currentEvent?.id);
        if (countError) {
            console.error('Error fetching minting request count:', countError);
            return;
        }
        if (count >= 1) {
            const { error: updateError } = await supabase
                .from('CentralBankEvents')
                .update({ status: 'approved', approved_at: new Date() })
                .eq('id', currentEvent?.id);
            if (updateError) {
                console.error('Error updating minting event:', updateError);
                return;
            }
            console.log('Minting event updated successfully');
        }

        const { data: supplyData, error: supplyError } = await supabase.from('TokenSupply').select('total_minted').eq('id', 1);
        if (supplyError) {
            console.error('Error fetching supply:', supplyError);
            return;
        }
        if (supplyData) {
            const newSupply = supplyData[0].total_minted + currentEvent?.amount;
            const { error: updateSupplyError } = await supabase.from('TokenSupply').update({ total_minted: newSupply }).eq('id', 1);
            if (updateSupplyError) {
                console.error('Error updating supply:', updateSupplyError);
                return;
            }
        }
        console.log('Minting supply updated successfully');

        // send notification to all other central bank users
        const { data: users, error: usersError } = await supabase.from('Users').select('id').eq('role', 'central_bank').neq('id', currentUser?.id);
        if (usersError) {
            console.error('Error fetching users:', usersError);
            return;
        }
        if (users) {
            users.forEach(async (user) => {
                const { error: notificationError } = await supabase.from('Notifications').insert({
                    user_id: user.id,
                    message: `New minting request for ${currentEvent?.amount} tokens approved by ${currentUser?.name}`,
                    type: 'minting_approval',
                    event_id: currentEvent?.id || '',
                });
                if (notificationError) {
                    console.error('Error inserting notification:', notificationError);
                }
            });
        }
        setShowSuccessDialog(true);
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
                    <Card className="w-full bg-card">
                        {/* <CardHeader className="p-4 sm:p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg sm:text-xl">X</CardTitle>
                                    <CardDescription className="text-sm">Review the approval records with their status and timestamps.</CardDescription>
                                </div>
                            </div>
                        </CardHeader> */}

                        <CardContent className="p-4 sm:p-6">
                            {/* Search */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by ID or description..."
                                        className="pl-8 w-full"
                                        // value={searchQuery}
                                        // onChange={handleSearchChange}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="rounded-md border overflow-x-auto">
                                <div className="min-w-full">
                                    {/* Desktop Header */}
                                    <div className="hidden sm:grid grid-cols-12 gap-2 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground sticky top-0 z-10">
                                        <div className="col-span-2">ID</div>
                                        <div className="col-span-2">Created At</div>
                                        <div className="col-span-2">Amount</div>
                                        <div className="col-span-2">Minted By</div>
                                        <div className="col-span-2">Approved At</div>
                                        <div className="col-span-1 text-center">Status</div>
                                        <div className="col-span-1">Note</div>
                                    </div>

                                    {/* Table Body */}
                                    {mintEvents.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">No records found.</div>
                                    ) : (
                                        <div className="divide-y">
                                            {mintEvents.map((record) => (
                                                <motion.div
                                                    key={record.id}
                                                    className="flex flex-col sm:grid sm:grid-cols-12 gap-2 p-4 text-xs sm:text-sm hover:bg-muted/50 transition-colors cursor-pointer"
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
                                                    {/* Mobile stacked view */}
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">ID:</span>
                                                        <span className="truncate" title={record.id}>
                                                            {record.id}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Created At:</span>
                                                        <span>{formatDate(record.created_at)}</span>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Amount:</span>
                                                        <span>{record.amount ? Number(record.amount).toLocaleString() : '0'} CBDC</span>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Minted By:</span>
                                                        <span className="truncate">{record.minted_by_user?.name || '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Approved At:</span>
                                                        <span>{record.approved_at ? formatDate(record.approved_at) : '-'}</span>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Status:</span>
                                                        <Badge className="text-xs capitalize">{record.status}</Badge>
                                                    </div>
                                                    <div className="flex justify-between sm:hidden">
                                                        <span className="font-medium">Note:</span>
                                                        <span className="truncate">{record.note}</span>
                                                    </div>

                                                    {/* Desktop grid view */}
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.id}>
                                                        {record.id}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.created_at}>
                                                        {formatDate(record.created_at)}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.amount}>
                                                        {record.amount ? Number(record.amount).toLocaleString() : '0'} CBDC
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.minted_by}>
                                                        {record.minted_by_user?.name || '-'}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-2 truncate" title={record.approved_at}>
                                                        {record.approved_at ? formatDate(record.approved_at) : '-'}
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-1 text-center">
                                                        <Badge className="text-xs capitalize">{record.status}</Badge>
                                                    </div>
                                                    <div className="hidden sm:block sm:col-span-1 truncate" title={record.note}>
                                                        {record.note}
                                                    </div>
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
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-medium">{currentEvent?.created_at.toLocaleString()}</span>
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
                                <DialogDescription>Enter the 6-digit code from your authenticator app to verify your identity.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Key className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">A secure 6-digit code has been sent to your authenticator app</p>
                                    </div>
                                    <div className="w-full max-w-[200px]">
                                        <Input value={mfaCode} onChange={handleMfaCodeChange} maxLength={6} className="text-center text-xl tracking-widest" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowMfaDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleVerifyMfa} disabled={!isMfaValid}>
                                    Verify & Submit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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
                                    {/* <p className="text-sm text-muted-foreground">
                                        You will receive a notification once all required approvals are complete and the minting operation is finalized.
                                    </p> */}
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
