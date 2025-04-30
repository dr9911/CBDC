import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import TransactionList from '../dashboard/TransactionList';
import { useAuth } from '@/context/AuthContext';
import { parse } from 'path';

const HistoryPage = () => {
    const { currentUser } = useAuth();
    const userName = currentUser?.name || 'User';
    const transactions = localStorage.getItem('transactions');
    const parsedTransactions = transactions ? JSON.parse(transactions) : [];

    return (
        <DashboardLayout activePage="history">
            <div className="space-y-6 px-4 sm:px-6">
                <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
                <p className="text-muted-foreground">View all your transaction history and activity.</p>
                <div className="grid gap-6">
                    <TransactionList transactions={parsedTransactions} showAllTransactions={true} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HistoryPage;
