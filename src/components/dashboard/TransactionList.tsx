import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter, // Kept for potential future use, but Selects are used now
    ArrowUpDown,
    Eye,
    Download,
    MoreHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns'; // Using date-fns for robust formatting

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get currentUser

// --- Updated Transaction Interface ---
export interface Transaction {
    id: string;
    sender: string; // User ID or Bank ID
    receiver: string; // User ID or Bank ID
    amount: number;
    timestamp: string; // ISO 8601 format string
    status: 'completed' | 'pending' | 'failed';
    type: 'user_to_user' | 'bank_to_user' | 'user_to_bank' | 'mint'; // Add more as needed
    receiverName?: {
        name: string; // Assuming receiverName is an object with a name property
    };
}

// --- Updated Props Interface ---
interface TransactionListProps {
    transactions?: Transaction[];
    onViewTransaction?: (id: string) => void;
    showAllTransactions?: boolean;
    title?: string;
    description?: string;
    maxRows?: number;
    currency?: string;
}

const TransactionList = ({
    transactions = [],
    onViewTransaction = () => {},
    title = 'Transaction History',
    maxRows,
    currency = 'CBDC',
    showAllTransactions = false,
}: TransactionListProps) => {
    const navigate = useNavigate();

    const { currentUser } = useAuth();
    const currentUserId = currentUser?.id;

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const getTransactionDirection = (transaction: Transaction): 'incoming' | 'outgoing' | 'internal' | 'unknown' => {
        if (!transaction.sender || !transaction.receiver) return 'unknown';
        if (!currentUserId) return 'unknown';
        if (transaction.sender === currentUserId && transaction.receiver === currentUserId) return 'internal';
        if (transaction.sender === currentUserId) return 'outgoing';
        if (transaction.receiver === currentUserId) return 'incoming';
        return 'unknown';
    };

    const getCounterpartyId = (transaction: Transaction): string => {
        const direction = getTransactionDirection(transaction);
        if (direction === 'incoming') return transaction.sender;
        if (direction === 'outgoing') return transaction.receiver;
        return 'N/A';
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
    };

    const handleTypeFilterChange = (value: string) => {
        setTypeFilter(value);
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const formatDate = (dateString: string) => {
        try {
            // Example format: Mar 31, 2025, 12:00 PM
            return format(new Date(dateString), 'PPp');
        } catch (e) {
            console.error('Failed to format date:', dateString, e);
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount: number, currencyCode: string) => {
        try {
            return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch (e) {
            console.warn(`Currency formatting failed for code '${currencyCode}'. Falling back.`, e);
            return `${currencyCode} ${amount.toFixed(2)}`;
        }
    };

    const getStatusBadgeVariant = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'failed':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const processedTransactions = transactions
        .filter((transaction) => {
            const direction = getTransactionDirection(transaction);

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const counterpartyId = getCounterpartyId(transaction);
                const amountString = String(transaction.amount);

                const idMatch = transaction.id.toLowerCase().includes(searchLower);
                const senderMatch = transaction.sender.toLowerCase().includes(searchLower);
                const receiverMatch = transaction.receiver.toLowerCase().includes(searchLower);
                const counterpartyMatch = counterpartyId.toLowerCase().includes(searchLower);
                const amountMatch = amountString.includes(searchLower);

                if (!(idMatch || senderMatch || receiverMatch || counterpartyMatch || amountMatch)) {
                    return false;
                }
            }

            if (statusFilter !== 'all' && transaction.status !== statusFilter) {
                return false;
            }

            if (typeFilter !== 'all' && direction !== typeFilter) {
                if (typeFilter === 'incoming' || typeFilter === 'outgoing') {
                    return false;
                }
            }

            if (currentUserId && !(transaction.sender === currentUserId || transaction.receiver === currentUserId)) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            const validDateA = !isNaN(dateA) ? dateA : 0;
            const validDateB = !isNaN(dateB) ? dateB : 0;
            return sortDirection === 'asc' ? validDateA - validDateB : validDateB - validDateA;
        });

    const displayTransactions = maxRows ? processedTransactions.slice(0, maxRows) : processedTransactions;

    return (
        <Card className="w-full bg-card">
            <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                        <CardDescription className="text-sm">
                            {showAllTransactions ? 'All transactions' : 'View and manage your transaction history'}
                        </CardDescription>
                    </div>
                    {/* <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert('Export not implemented')}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div> */}
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
                {/* Top Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search ID, Party, Amount..."
                            className="pl-8 w-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                            <SelectTrigger className="w-full sm:w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="incoming">Incoming</SelectItem>
                                <SelectItem value="outgoing">Outgoing</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSortDirection}
                            title={`Sort by date ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="w-full overflow-x-auto">
                    <div className="min-w-full">
                        {/* Header */}
                        <div className="hidden sm:grid grid-cols-12 gap-2 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground sticky top-0 z-10">
                            <div className="col-span-3">Timestamp</div>
                            <div className="col-span-2 text-right">Amount</div>
                            <div className="col-span-2">Direction</div>
                            <div className="col-span-3">Receiver</div>
                            <div className="col-span-2 text-center">Status</div>
                        </div>

                        {/* Rows */}
                        {displayTransactions.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No transactions found matching your criteria.</div>
                        ) : (
                            <div className="divide-y">
                                {displayTransactions.map((transaction) => {
                                    const direction = getTransactionDirection(transaction);

                                    return (
                                        <motion.div
                                            key={transaction.id}
                                            className="flex flex-col sm:grid sm:grid-cols-12 gap-2 p-4 text-xs sm:text-sm hover:bg-muted/50 transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Mobile stacked view */}
                                            <div className="flex justify-between sm:hidden">
                                                <span className="font-medium">Timestamp:</span>
                                                <span>{formatDate(transaction.timestamp)}</span>
                                            </div>
                                            <div className="flex justify-between sm:hidden">
                                                <span className="font-medium">Amount:</span>
                                                <span
                                                    className={
                                                        direction === 'incoming'
                                                            ? 'text-green-600'
                                                            : direction === 'outgoing'
                                                              ? 'text-red-600'
                                                              : 'text-foreground'
                                                    }
                                                >
                                                    {direction === 'incoming' ? '+' : direction === 'outgoing' ? '-' : ''}
                                                    {formatCurrency(transaction.amount, currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between sm:hidden">
                                                <span className="font-medium">Direction:</span>
                                                <Badge
                                                    variant={direction === 'incoming' ? 'default' : 'secondary'}
                                                    className={
                                                        direction === 'incoming'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-100 text-xs'
                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs'
                                                    }
                                                >
                                                    {direction === 'incoming' ? 'Received' : 'Sent'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between sm:hidden">
                                                <span className="font-medium">Receiver:</span>
                                                <span className="truncate" title={transaction?.receiverName?.name}>
                                                    {transaction?.receiverName?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between sm:hidden">
                                                <span className="font-medium">Status:</span>
                                                <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs capitalize">
                                                    {transaction.status}
                                                </Badge>
                                            </div>

                                            {/* Desktop grid view */}
                                            <div className="hidden sm:block sm:col-span-3 truncate" title={transaction.timestamp}>
                                                {formatDate(transaction.timestamp)}
                                            </div>
                                            <div className="hidden sm:block sm:col-span-2 font-medium text-right">
                                                <span
                                                    className={
                                                        direction === 'incoming'
                                                            ? 'text-green-600'
                                                            : direction === 'outgoing'
                                                              ? 'text-red-600'
                                                              : 'text-foreground'
                                                    }
                                                >
                                                    {direction === 'incoming' ? '+' : direction === 'outgoing' ? '-' : ''}
                                                    {formatCurrency(transaction.amount, currency)}
                                                </span>
                                            </div>
                                            <div className="hidden sm:block sm:col-span-2">
                                                <Badge
                                                    variant={direction === 'incoming' ? 'default' : 'secondary'}
                                                    className={
                                                        direction === 'incoming'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-100 text-xs'
                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs'
                                                    }
                                                >
                                                    {direction === 'incoming' ? 'Received' : 'Sent'}
                                                </Badge>
                                            </div>
                                            <div className="hidden sm:block sm:col-span-3 truncate" title={transaction?.receiverName?.name}>
                                                {transaction?.receiverName?.name}
                                            </div>
                                            <div className="hidden sm:block sm:col-span-2 text-center">
                                                <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs capitalize">
                                                    {transaction.status}
                                                </Badge>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination / Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                        {processedTransactions.length} transaction(s) found.
                        {maxRows && processedTransactions.length > maxRows ? ` Showing first ${maxRows}.` : ''}
                    </div>
                    <div>
                        {!showAllTransactions && (
                            <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                                View All Transactions
                            </Button>
                        )}
                    </div>
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
    );
};

export default TransactionList;
