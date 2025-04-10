import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from './layout/DashboardLayout';
import CommercialBankOverview from './dashboard/CommercialBankOverview';
import BalanceCard from './dashboard/BalanceCard';
import AssetsCard from './dashboard/AssetsCard';
import TransactionList, { Transaction } from './dashboard/TransactionList';
import TransactionForm from './transactions/TransactionForm';
import QRCodeGenerator from './transactions/QRCodeGenerator';
import { useAuth } from '@/context/AuthContext';
import transactions from '@/data/transactions.json';
import { supabase } from '@/utils/supabase';

interface HomeProps {
    userName?: string;
    userAvatar?: string;
    isAuthenticated?: boolean;
    sessionTimeRemaining?: number;
    notificationCount?: number;
    recentTransactions?: Array<{
        id: string;
        date: string;
        type: 'incoming' | 'outgoing';
        amount: number;
        recipient: string;
        status: 'completed' | 'pending' | 'failed';
        reference?: string;
    }>;
}

const Home = ({ userName, userAvatar, isAuthenticated, sessionTimeRemaining, notificationCount = 3 }: HomeProps) => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (currentUser) {
            setUserData(currentUser);
        }
    }, [currentUser]);
    useEffect(() => {
        if (!userData?.id) return;

        const fetchTransactions = async () => {
            const { data: transactionsList, error } = await supabase.from('Transactions').select('*').or(`sender.eq.${userData.id},receiver.eq.${userData.id}`);

            if (error) {
                console.error('Error fetching transactions:', error);
                return;
            }

            if (transactionsList) {
                setTransactions(transactionsList as Transaction[]);
            }
        };

        fetchTransactions();
    }, [userData]);

    const transactionsList = localStorage.getItem('transactions');
    const parsedTransactions = transactionsList ? JSON.parse(transactionsList) : [];

    const effectiveUserName = userName || userData?.name || 'John Doe';
    const effectiveUserAvatar = userAvatar || userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=John`;
    const userRole = userData?.role || 'user';

    const handleViewTransaction = (id: string) => {
        console.log(`View transaction details for ID: ${id}`);
    };

    // Function to handle transaction form submission
    const handleTransactionSubmit = (values: any) => {
        console.log('Transaction submitted:', values);
        // In a real app, this would process the transaction
    };

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="fixed inset-0">
            <DashboardLayout
                userName={effectiveUserName}
                userAvatar={effectiveUserAvatar}
                isAuthenticated={isAuthenticated}
                sessionTimeRemaining={sessionTimeRemaining}
                notificationCount={notificationCount}
            >
                <div className="h-full">
                    <div className="h-full overflow-auto px-4 sm:px-6 pb-6">
                        <div className="space-y-6 sm:space-y-8">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>

                                {/* Flex container with a very small gap */}
                                <div className="flex flex-col md:flex-row gap-5 mb-6 sm:mb-8">
                                    <div>
                                        <BalanceCard balance={userData?.balance} />
                                    </div>
                                    {userRole === 'user' && (
                                        <div>
                                            <AssetsCard stocks={100000} bonds={50000} securities={25000} />
                                        </div>
                                    )}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <TransactionList transactions={transactions} maxRows={5} onViewTransaction={handleViewTransaction} />
                                </motion.div>

                                {userRole === 'commercial_bank' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="mb-6 sm:mb-8"
                                    >
                                        <CommercialBankOverview />
                                    </motion.div>
                                )}
                            </motion.div>

                            <div className="hidden">
                                <TransactionForm onSubmit={handleTransactionSubmit} />
                            </div>

                            <div className="hidden">
                                <QRCodeGenerator accountName={effectiveUserName} />
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
};

export default Home;
