import React, { useState, useRef, useEffect } from 'react';
import { Banknote, AlertTriangle, CheckCircle2, Key, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '../layout/DashboardLayout';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import { sendOtpToEmail, verifyOtp } from '@/utils/otpService';
import { AnimatePresence, motion } from 'framer-motion';

interface MintNewSupplyProps {
    totalSupply?: number;
}

const MintNewSupply = ({ totalSupply = 10000000 }: MintNewSupplyProps) => {
    const { currentUser } = useAuth();

    // form state
    const [numTokens, setNumTokens] = useState<string>('');
    const [purpose, setPurpose] = useState<string>('');
    const [documentDate, setDocumentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [errorMessage, setErrorMessage] = useState('');

    // supply, mint result & dialogs
    const [supply, setSupply] = useState<number>(0);
    const [mintId, setMintId] = useState<string>('');
    const [mfaCode, setMfaCode] = useState<string>('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showMfaDialog, setShowMfaDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // OTP
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authStep, setAuthStep] = useState<'confirm' | 'loading' | 'mfa'>('confirm');
    const [isVerifying, setIsVerifying] = useState(false);

    // fetch current total supply on mount
    useEffect(() => {
        const fetchSupply = async () => {
            const { data, error } = await supabase.from('TokenSupply').select('total_minted').single();
            if (error) {
                console.error('Error fetching supply:', error);
            } else {
                setSupply(data.total_minted || 0);
            }
        };
        fetchSupply();
    }, []);

    // handlers
    const handleNumTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNumTokens(e.target.value.replace(/[^0-9.]/g, ''));
    };

    const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPurpose(e.target.value);
    };

    const handleDocumentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentDate(e.target.value);
    };

    const handleSubmit = () => {
        setAuthStep('confirm');
        setShowAuthDialog(true);
    };

    /** 1️⃣ Send OTP and open the MFA prompt */
    const handleConfirmMinting = async () => {
        setAuthStep('loading');

        try {
            if (currentUser?.email) {
                await sendOtpToEmail(currentUser.email);
                console.log(`✅ OTP sent to ${currentUser.email}`);
                setAuthStep('mfa');
            } else {
                console.error('❌ User email not found');
                setErrorMessage('User email not found.');
                setShowAuthDialog(false);
            }
        } catch (error) {
            console.error('❌ Error sending OTP:', error.message);
            setErrorMessage('Failed to send OTP. Please try again.');
            setShowAuthDialog(false);
        }
    };

    /** 2️⃣ Verify OTP, insert mint event & notify others */
    const handleVerifyMfa = async () => {
        try {
            setIsVerifying(true);
            setErrorMessage('');

            // 🔐 Step 1: Verify OTP
            await verifyOtp(currentUser.email!, mfaCode);
            console.log('✅ OTP verified');

            // 🧾 Step 2: Insert mint event
            const { data: mintData, error: mintError } = await supabase
                .from('CentralBankEvents')
                .insert({
                    amount: Number(numTokens),
                    minted_by: currentUser.id,
                    status: 'pending',
                    note: purpose,
                    type: 'mint',
                    document_date: documentDate,
                })
                .select()
                .single();

            if (mintError) throw mintError;
            setMintId(mintData.id);

            // 📣 Step 3: Notify other central bank users
            const { data: users, error: usersError } = await supabase.from('Users').select('id').eq('role', 'central_bank').neq('id', currentUser.id);

            if (usersError) throw usersError;

            await Promise.all(
                users.map((u) =>
                    supabase.from('Notifications').insert({
                        user_id: u.id,
                        message: `New minting request for ${numTokens} tokens`,
                        type: 'minting_request',
                        event_id: mintData.id,
                    })
                )
            );

            // ✅ Final: Reset states and show success
            setShowAuthDialog(false); // hide OTP dialog
            setShowSuccessDialog(true); // show success dialog
            setAuthStep('confirm'); // reset for future use
            setMfaCode(''); // clear OTP input
        } catch (err: any) {
            console.error('❌ Verification or mint failed:', err);
            setErrorMessage(err.message || 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleMfaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMfaCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        setNumTokens('');
        setPurpose('');
        setDocumentDate(new Date().toISOString().split('T')[0]);
        setMfaCode('');
        setErrorMessage('');
    };

    const isFormValid = Boolean(numTokens && purpose && documentDate);
    const isMfaValid = mfaCode.length === 6;

    // ----------------------------------------------------------------
    // 3) RENDER
    // ----------------------------------------------------------------
    return (
        <DashboardLayout activePage="mint">
            <div className="space-y-6 px-4 sm:px-6">
                {/* Page Heading */}
                <div>
                    <h1 className="text-3xl font-bold">Mint New CBDC Supply</h1>
                </div>

                {/* Card: Total Supply */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total CBDC Minted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold">{supply.toLocaleString()} CBDC</div>
                            <Banknote className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Authorized by Central Bank</p>
                    </CardContent>
                </Card>

                {/* Minting Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mint New Digital Currency</CardTitle>
                        <CardDescription>Create new CBDC tokens with secure multi-signature approval</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="num-tokens">Number of tokens</Label>
                                <Input id="num-tokens" value={numTokens} onChange={handleNumTokensChange} className="max-w-xs" />
                            </div>
                            <div className="mt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="remark">Remark</Label>
                                    <Input id="remark" value={purpose} onChange={handlePurposeChange} className="max-w-xs" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!isFormValid}>
                            Proceed to Verification
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* CONFIRMATION DIALOG + MFA Dialog */}
            <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {authStep === 'confirm'
                                ? 'Confirm Minting Operation'
                                : authStep === 'loading'
                                  ? 'Sending Verification Code...'
                                  : 'Email Verification Required'}
                        </DialogTitle>
                        <DialogDescription>
                            {authStep === 'confirm'
                                ? 'Please review the details of this minting operation before proceeding.'
                                : authStep === 'mfa'
                                  ? 'A 6-digit OTP has been sent to your email. Enter it below to verify:'
                                  : ''}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {authStep === 'confirm' && (
                            <>
                                <div className="bg-muted p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Number of Tokens:</span>
                                        <span className="font-medium">{numTokens ? Number(numTokens).toLocaleString() : '0'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Remark:</span>
                                        <span className="font-medium">{purpose}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-medium">{new Date().toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-amber-800 font-medium">This action requires email verification</p>
                                        <p className="text-xs text-amber-700 mt-1">An OTP code will be sent to your email. Enter it to confirm minting.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {authStep === 'loading' && (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {authStep === 'mfa' && (
                            <div className="flex flex-col items-center justify-center gap-6">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Key className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Check your inbox for the OTP code sent to <strong>{currentUser?.email}</strong>.
                                    </p>
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

                                {/* Error Message */}
                                {errorMessage && <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAuthDialog(false)} disabled={authStep === 'loading' || isVerifying}>
                            Cancel
                        </Button>

                        {authStep === 'confirm' && <Button onClick={handleConfirmMinting}>Proceed to Authentication</Button>}

                        {authStep === 'mfa' && (
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
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SUCCESS DIALOG */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Minting Request Submitted</DialogTitle>
                        <DialogDescription>Your request to mint new CBDC has been successfully submitted.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-medium text-lg">Minting Request ID: {mintId}</h3>
                                <p className="text-sm text-muted-foreground mt-1">Submitted on {new Date().toLocaleString()}</p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg w-full space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Number of Tokens:</span>
                                    <span className="font-medium">{numTokens ? Number(numTokens).toLocaleString() : '0'} CBDC</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                You will receive a notification once all required approvals are complete and the minting operation is finalized.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCloseSuccess}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default MintNewSupply;
