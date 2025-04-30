import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import TransactionList, { Transaction } from './TransactionList';
import DashboardLayout from '../layout/DashboardLayout';
import BalanceCard from './BalanceCard';
import TransactionForm from '../transactions/TransactionForm';

const Transfer = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [tokenSupply, setTokenSupply] = useState({
        total_minted: 0,
        distributed: 0,
        bank_notes_issued: 0,
        bank_notes_redeemed: 0,
    });
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchTokenSupply = async () => {
            const { data: tokenSupply, error } = await supabase.from('TokenSupply').select('*').single();

            if (error) {
                console.error('Error fetching token supply:', error);
                return;
            }

            if (tokenSupply) {
                console.log('Token Supply:', tokenSupply);
            }
            setTokenSupply(tokenSupply);
        };

        const fetchTransactions = async () => {
            const { data: transactionsList, error } = await supabase
                .from('Transactions')
                .select('*, receiverName:Users(name)')
                .or(`sender.eq.${currentUser.id},receiver.eq.${currentUser.id}`);

            localStorage.setItem('transactions', JSON.stringify(transactionsList));

            if (error) {
                console.error('Error fetching transactions:', error);
                return;
            }

            if (transactionsList) {
                setTransactions(transactionsList as Transaction[]);
            }
        };

        fetchTokenSupply();
        fetchTransactions();
    }, [currentUser]);

    const { total_minted, distributed, bank_notes_issued, bank_notes_redeemed } = tokenSupply;


    const handleViewTransaction = (id: string) => {
        console.log(`View transaction details for ID: ${id}`);
    };

    // Function to handle transaction form submission
    const handleTransactionSubmit = (values: any) => {
        console.log('Transaction submitted:', values);
        // In a real app, this would process the transaction
    };

    if (!currentUser) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="fixed inset-0">
            <DashboardLayout>
                <div className="h-full">
                    <div className="h-full overflow-auto px-4 sm:px-6 pb-6">
                        <div className="space-y-6 sm:space-y-8">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Transfer</h1>

                                {/* Flex container with a very small gap */}
                                <div className="flex flex-col md:flex-row gap-5 mb-6 sm:mb-8">
                                    <div>{tokenSupply && <BalanceCard balance={total_minted - distributed - bank_notes_issued} />}</div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="mb-6"
                                >
                                    <TransactionList transactions={transactions} maxRows={5} onViewTransaction={handleViewTransaction} />
                                </motion.div>
                            </motion.div>

                            <div className="hidden">
                                <TransactionForm onSubmit={handleTransactionSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
};

export default Transfer;
