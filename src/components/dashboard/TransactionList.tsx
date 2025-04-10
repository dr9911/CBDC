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
        console.log('Transaction:', transaction);
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
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert('Export not implemented')}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search ID, Party, Amount..." className="pl-8" value={searchQuery} onChange={handleSearchChange} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
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

                {/* Transactions list */}
                <div className="rounded-md border overflow-x-auto">
                    {/* Using min-w to ensure content doesn't wrap too aggressively on small screens */}
                    <div className="min-w-[700px] lg:min-w-0">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-xs sm:text-sm font-medium text-muted-foreground sticky top-0 z-10">
                            <div className="col-span-3 md:col-span-3">Timestamp</div>
                            <div className="col-span-2 md:col-span-2">Direction</div>
                            <div className="col-span-3 md:col-span-3 text-right">Amount</div>
                            {/* Renamed Recipient to Counterparty */}
                            <div className="hidden md:block md:col-span-2">Counterparty</div>
                            <div className="col-span-2 md:col-span-1 text-center">Status</div>
                            <div className="col-span-2 md:col-span-1 text-right">Actions</div>
                        </div>

                        {/* Transaction Rows */}
                        {displayTransactions.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No transactions found matching your criteria.</div>
                        ) : (
                            <div className="divide-y">
                                {displayTransactions.map((transaction) => {
                                    const direction = getTransactionDirection(transaction);
                                    const counterpartyId = getCounterpartyId(transaction);
                                    // const counterpartyDisplay = getUserDisplay(counterpartyId); // Use mapping if available

                                    return (
                                        <motion.div
                                            key={transaction.id}
                                            className="grid grid-cols-12 gap-2 p-4 items-center text-xs sm:text-sm hover:bg-muted/50 transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }} // Add exit animation if using Framer Motion's AnimatePresence
                                            transition={{ duration: 0.2 }}
                                        >
                                            {/* Timestamp */}
                                            <div className="col-span-3 md:col-span-3 truncate" title={transaction.timestamp}>
                                                {formatDate(transaction.timestamp)}
                                            </div>
                                            {/* Direction */}
                                            <div className="col-span-2 md:col-span-2">
                                                <Badge
                                                    variant={getTransactionDirection(transaction) === 'incoming' ? 'default' : 'secondary'}
                                                    className={
                                                        getTransactionDirection(transaction) === 'incoming'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-100 text-xs'
                                                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs'
                                                    }
                                                >
                                                    {getTransactionDirection(transaction) === 'incoming' ? 'Received' : 'Sent'}
                                                </Badge>{' '}
                                            </div>
                                            {/* Amount */}
                                            <div className="col-span-3 md:col-span-3 font-medium text-right">
                                                <span
                                                    className={
                                                        direction === 'incoming'
                                                            ? 'text-green-600'
                                                            : direction === 'outgoing'
                                                              ? 'text-red-600' // Make outgoing red for clarity
                                                              : 'text-foreground' // Neutral for internal/unknown
                                                    }
                                                >
                                                    {direction === 'incoming' ? '+' : direction === 'outgoing' ? '-' : ''}
                                                    {formatCurrency(transaction.amount, currency)}
                                                </span>
                                            </div>
                                            {/* Counterparty */}
                                            <div className="hidden md:block md:col-span-2 truncate" title={counterpartyId}>
                                                {/* {counterpartyDisplay} Using ID for now */}
                                                {counterpartyId}
                                            </div>
                                            {/* Status */}
                                            <div className="col-span-2 md:col-span-1 text-center">
                                                <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-xs capitalize">
                                                    {transaction.status}
                                                </Badge>
                                            </div>
                                            {/* Actions */}
                                            <div className="col-span-2 md:col-span-1 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Transaction Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => onViewTransaction(transaction.id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => alert('Download Receipt not implemented')}>
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download Receipt
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination / View All Link placeholder */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 pt-4 mt-4 border-t">
                    {/* Optional: Show total count */}
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
                    {/* Optional: Add actual pagination controls here */}
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
