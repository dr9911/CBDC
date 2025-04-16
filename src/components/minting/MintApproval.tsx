import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '../layout/DashboardLayout';

import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, Key, Search } from 'lucide-react';
import { format, formatDate, set } from 'date-fns';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';

interface MintApprovalProps {
    confirmDialogOpen?: boolean;
    notification?: any;
}

const MintApproval = ({ confirmDialogOpen: propConfirmDialogOpen, notification: propNotification }: MintApprovalProps) => {
    const { currentUser } = useAuth();
    const [supply, setSupply] = useState<number>(0);
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
            console.log('Fetching supply from database...');
            console.log('Notification:', notification);

            const { data, error } = await supabase.from('MintEvents').select('*');

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
            return format(new Date(dateString), 'PPp');
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
            <div className="space-y-6">
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
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by ID or description..."
                                        className="pl-8"
                                        // value={searchQuery}
                                        // onChange={handleSearchChange}
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="rounded-md border overflow-x-auto">
                                <div className="min-w-[700px] lg:min-w-0">
                                    <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground sticky top-0 z-10">
                                        <div className="col-span-2">ID</div>
                                        <div className="col-span-3">Created At</div>
                                        <div className="col-span-3">Approved At</div>
                                        <div className="col-span-2 text-center">Status</div>
                                        <div className="col-span-2">Description</div>
                                    </div>

                                    {mintEvents.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">No records found.</div>
                                    ) : (
                                        <div className="divide-y">
                                            {mintEvents.map((record) => (
                                                <motion.div
                                                    key={record.id}
                                                    className="grid grid-cols-12 gap-2 p-4 items-center text-xs sm:text-sm hover:bg-muted/50 transition-colors"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="col-span-2 truncate" title={record.id}>
                                                        {record.id}
                                                    </div>
                                                    <div className="col-span-3 truncate" title={record.created_at}>
                                                        {formatDate(record.created_at)}
                                                    </div>
                                                    <div className="col-span-3 truncate" title={record.approved_at}>
                                                        {formatDate(record.approved_at)}
                                                    </div>
                                                    <div className="col-span-2 text-center">
                                                        <Badge className="text-xs capitalize">{record.status}</Badge>
                                                    </div>
                                                    <div className="col-span-2 truncate" title={record.description}>
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
                                {/* Pagination (optional) */}
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
                                        <span className="font-medium">{notification.type}</span>
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
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MintApproval;
