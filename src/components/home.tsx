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
import { supabase } from '@/utils/supabase';

interface HomeProps {
    userName?: string;
    userAvatar?: string;
    isAuthenticated?: boolean;
    sessionTimeRemaining?: number;
}

const Home = ({ userName, userAvatar, isAuthenticated, sessionTimeRemaining }: HomeProps) => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchTransactions = async () => {
            const { data, error } = await supabase
                .from('Transactions')
                .select('*, receiverName:Users(name)')
                .or(`sender.eq.${currentUser.id},receiver.eq.${currentUser.id}`);

            if (error) {
                console.error('Error fetching transactions:', error);
                return;
            }

            if (data) {
                setTransactions(data as Transaction[]);
                localStorage.setItem('transactions', JSON.stringify(data));
            }
        };

        fetchTransactions();
    }, [currentUser]);

    const effectiveUserName = userName || currentUser?.name || 'John Doe';
    const effectiveUserAvatar = userAvatar || currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=John`;
    const userRole = currentUser?.role || 'user';

    const handleViewTransaction = (id: string) => {
        console.log(`View transaction details for ID: ${id}`);
    };

    const handleTransactionSubmit = (values: any) => {
        console.log('Transaction submitted:', values);
    };

    if (!currentUser) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="fixed inset-0">
            <DashboardLayout
                userName={effectiveUserName}
                userAvatar={effectiveUserAvatar}
                isAuthenticated={isAuthenticated}
                sessionTimeRemaining={sessionTimeRemaining}
            >
                <div className="h-full flex flex-col">
                    <div className="h-full overflow-auto px-4 sm:px-6 pb-6">
                        <div className="space-y-6 sm:space-y-8">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Dashboard</h1>

                                {/* Cards side-by-side */}
                                <div className="flex flex-col md:flex-row md:items-start md:gap-4 mb-6 sm:mb-8">
                                    <div className="w-full md:w-1/2">
                                        <BalanceCard balance={currentUser.balance} />
                                    </div>
                                    {userRole === 'user' && (
                                        <div className="w-full md:w-1/2">
                                            <AssetsCard stocks={100000} bonds={50000} securities={25000} />
                                        </div>
                                    )}
                                </div>

                                {/* Transactions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <TransactionList transactions={transactions} maxRows={5} onViewTransaction={handleViewTransaction} />
                                </motion.div>

                                {/* Optional section for commercial banks */}
                                {/* 
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
                */}
                            </motion.div>

                            {/* Hidden extra tools */}
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
