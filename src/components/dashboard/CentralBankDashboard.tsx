// src/components/dashboard/CentralBankDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUp,
    ArrowDown,
    Repeat,
    ArrowUpRight,
    ArrowDownRight,
    Banknote,
    Shield,
    Activity,
    Clock,
    CheckCircle,
    Inbox as InboxIcon,
    Info,
    TrendingUp,
    BarChart,
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, ChartTooltip, Legend);

import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const CentralBankDashboard = () => {
    const { currentUser } = useAuth();
    const userId = currentUser?.id;

    const [totalMinted, setTotalMinted] = useState<number>(0);
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

    const [tokenData, setTokenData] = useState({
        total_minted: 0,
        distributed: 0,
        bank_notes_issued: 0,
        bank_notes_redeemed: 0,
    });

    useEffect(() => {
        const fetchTokenSupply = async () => {
            const { data, error } = await supabase.from('TokenSupply').select('*').single();
            if (error) {
                console.error('Failed to fetch token supply:', error);
                return;
            }
            setTotalMinted(data?.total_minted || 0);
            setTokenData(data);
        };

        fetchTokenSupply();
    }, []);

    const { total_minted, distributed, bank_notes_issued, bank_notes_redeemed } = tokenData;

    // const centralBankToken = total_minted - distributed - bank_notes_issued;

    const banknoteTokens = bank_notes_issued - bank_notes_redeemed;
    const centralBankTotalHoldings = total_minted - distributed - bank_notes_redeemed;
    const nonNoteTokens = centralBankTotalHoldings - banknoteTokens;
    const tokensInCirculation = distributed + bank_notes_redeemed; // Here we assume that all redeemed banknotes are in circulation
    // const tokensInCirculation = distributed + bank_notes_issued; // Here we assume that all issued banknotes are in circulation

    useEffect(() => {
        if (!userId) return;

        // initial fetch of pending approvals
        const fetchApprovals = async () => {
            const { data, error } = await supabase
                .from('Notifications')
                .select('*')
                .eq('user_id', userId)
                .eq('type', 'minting_request')
                .order('created_at', { ascending: false });

            if (error) console.error('Error loading approvals:', error);
            else setPendingApprovals(data);
        };
        fetchApprovals();

        // realtime subscription for new approvals
        const channel = supabase
            .channel(`notifications-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.new.type === 'minting_request') {
                        setPendingApprovals((prev) => [payload.new, ...prev]);
                    }
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // useEffect(() => {
    //     const stored = localStorage.getItem('users');
    //     const users = stored ? JSON.parse(stored) : [];
    //     const system = users.find((u: any) => u.id === 'system') || { totalMinted: 1_000_000 };
    //     setSystemData(system);
    //     setTotalMinted(system.totalMinted);
    // }, []);

    // Demo-derived metrics
    const connectedBanknotes = 5_800_000; // e.g. physical banknotes tracked
    const centralHoldingsDemo = 750_000; // demo digital holdings
    const withoutConnectedBanknotes = 400_000; // demo other holdings

    // Map to display variables
    const digitalCbdcInCirculation = centralHoldingsDemo;

    // Format Euro currency
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount) + ' CBDC';

    // Demo tasks
    const tasks = [
        {
            id: 1,
            icon: <Banknote className="h-5 w-5 text-amber-600" />,
            title: 'Review Minting Request',
            subtitle: 'From Commercial Bank #2',
            badge: 'Urgent',
            badgeColor: 'bg-amber-50 text-amber-600 border-amber-200',
        },
        {
            id: 2,
            icon: <Shield className="h-5 w-5 text-blue-600" />,
            title: 'Security Audit',
            subtitle: 'Quarterly Review',
            badge: 'This Week',
            badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
        },
    ];

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'CBDC Transactions Volume',
                data: [10, 65, 80, 70, 85, 90], // in millions
                borderColor: '#3b82f6',
                backgroundColor: (ctx: any) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (val: number) => `${val}m`,
                },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    const donutData = {
        datasets: [
            {
                label: 'CBDC Holdings Breakdown',
                data: [distributed, centralBankTotalHoldings, banknoteTokens],
                backgroundColor: ['#2563eb', '#6b7280', '#facc15'],
                borderWidth: 1,
            },
        ],
        labels: ['Distributed', 'Central Bank Holdings', 'DUAL'],
    };

    return (
        <DashboardLayout activePage="dashboard" userName={currentUser?.name || 'Central Bank'} userAvatar={currentUser?.avatar || ''}>
            <div className="space-y-8 pb-8 px-4 sm:px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Central Bank Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of CBDC operations and liquidity</p>
                    </div>
                </div>

                {/* Summary Metrics */}
                <Card className="bg-white border border-gray-200 shadow-md">
                    <CardHeader className="px-6 py-4">
                        <div className="bg-violet-50 rounded-t-lg px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-extrabold text-[#1f0d68] tracking-tight">
                                    Total CBDC Supply: {formatCurrency(total_minted)} CBDC
                                </h2>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col gap-6">
                            {/* Row 1: Split View */}
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Left Column */}
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    {/* Total Tokens In Circulation */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                        <div className="p-4 bg-violet-50 rounded-lg">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-6 w-6 text-green-600" />
                                                <span className="ml-2 text-sm font-medium">Total Tokens</span>
                                            </div>
                                            <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(total_minted - bank_notes_issued)}</div>
                                        </div>
                                    </motion.div>

                                    {/* Row with Tokens to User + Commercial Bank and Central Bank */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Tokens Distributed to Commercial/User */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full sm:w-1/2"
                                        >
                                            <div className="p-4 bg-blue-50 rounded-lg h-full">
                                                <div className="flex items-center text-gray-700">
                                                    <Banknote className="h-5 w-5 text-blue-600" />
                                                    <span className="ml-2 text-sm font-medium">Distributed to Banks and Users</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(distributed)}</div>
                                            </div>
                                        </motion.div>

                                        {/* Central Bank Balance */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full sm:w-1/2"
                                        >
                                            <div className="p-4 bg-red-50 rounded-lg h-full">
                                                <div className="flex items-center text-gray-700">
                                                    <Banknote className="h-5 w-5 text-indigo-500" />
                                                    <span className="ml-2 text-sm font-medium">Central Bank Balance</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-bold text-gray-900">
                                                    {formatCurrency(total_minted - distributed - bank_notes_issued)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    {/* TOTAL DUAL */}
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                        <div className="p-4 bg-violet-50 rounded-lg">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-5 w-5 text-amber-500" />
                                                <span className="ml-2 text-sm font-medium">Total DUAL issued</span>
                                            </div>
                                            <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(bank_notes_issued)}</div>
                                        </div>
                                    </motion.div>

                                    {/* Banknote Issue & Redeem */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* DUAL Redeemed */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full sm:w-1/2"
                                        >
                                            <div className="p-4 bg-blue-50 rounded-lg h-full">
                                                <div className="flex items-center text-gray-700">
                                                    <Banknote className="h-5 w-5 text-purple-600" />
                                                    <span className="ml-2 text-sm font-medium">DUAL Redeemed</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(bank_notes_redeemed)}</div>
                                            </div>
                                        </motion.div>

                                        {/* Central Bank DUAL */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full sm:w-1/2"
                                        >
                                            <div className="p-4 bg-red-50 rounded-lg h-full">
                                                <div className="flex items-center text-gray-700">
                                                    <Banknote className="h-5 w-5 text-rose-500" />
                                                    <span className="ml-2 text-sm font-medium">Central Bank DUAL</span>
                                                </div>
                                                <div className="mt-2 text-2xl font-bold text-gray-900">
                                                    {formatCurrency(bank_notes_issued - bank_notes_redeemed)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Total Central Bank Holdings and Total in Circulation */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <div className="flex gap-6">
                                    {/* Total Central Bank Holdings */}
                                    <div className="p-4 bg-red-50 rounded-lg w-full">
                                        <div className="flex items-center text-gray-700">
                                            <Banknote className="h-5 w-5 text-primary" />
                                            <span className="ml-2 text-sm font-medium">Total Central Bank Holdings</span>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(centralBankTotalHoldings)}</div>
                                    </div>

                                    {/* Total in Circulation */}
                                    <div className="p-4 bg-blue-50 rounded-lg w-full">
                                        <div className="flex items-center text-gray-700">
                                            <Banknote className="h-5 w-5 text-green-500" />
                                            <span className="ml-2 text-sm font-medium">Total in Circulation</span>
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(distributed + bank_notes_redeemed)}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>

                {/* Continue with other content like charts, recent transactions, and tasks/approvals */}
                {/* Charts & Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wallet Distribution Chart */}
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle>CBDC Wallet Value Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56 relative">
                                <Doughnut
                                    data={donutData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                    }}
                                />
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                {donutData.labels.map((label, index) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: donutData.datasets[0].backgroundColor[index] }} />
                                        <span className="text-sm text-gray-600">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions Volume Chart */}
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle>CBDC Transactions Volume (Last 6 Months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-75 flex items-center justify-center">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions and Approvals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="py-2">Type</th>
                                        <th className="py-2">Amount</th>
                                        <th className="py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="py-2 flex items-center gap-2">
                                            <ArrowUp className="text-green-500" size={16} /> Credit
                                        </td>
                                        <td className="py-2">75,000 TND</td>
                                        <td className="py-2 text-green-600 font-medium">Completed</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 flex items-center gap-2">
                                            <Repeat className="text-yellow-500" size={16} /> Transfer
                                        </td>
                                        <td className="py-2">10,000 TND</td>
                                        <td className="py-2 text-yellow-600 font-medium">Pending</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 flex items-center gap-2">
                                            <ArrowDown className="text-red-500" size={16} /> Debit
                                        </td>
                                        <td className="py-2">375,000 TND</td>
                                        <td className="py-2 text-green-600 font-medium">Completed</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Tasks & Approvals */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b flex justify-between items-center pb-3">
                            <CardTitle className="font-semibold">Tasks & Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="todo">
                                <TabsList className="grid grid-cols-3 mb-4 mt-4">
                                    <TabsTrigger value="todo">To Do</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="done">Completed</TabsTrigger>
                                </TabsList>

                                <TabsContent value="todo">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                    <InboxIcon className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800">Verify Customer Onboarding</h4>
                                                    <p className="text-xs text-gray-500">New user awaiting verification</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                                                High
                                            </Badge>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="pending">
                                    {pendingApprovals.length === 0 ? (
                                        <div className="flex flex-col items-center py-12 text-gray-400">
                                            <Clock className="h-8 w-8 mb-2" />
                                            <p>No pending approvals</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingApprovals.map((approval) => (
                                                <div
                                                    key={approval.id}
                                                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                                            <InboxIcon className="h-5 w-5 text-yellow-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800">{approval.title || 'Minting Request'}</h4>
                                                            <p className="text-xs text-gray-500">{approval.description || 'Awaiting central bank approval'}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                                        Pending
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="done">
                                    <div className="flex flex-col items-center py-12 text-gray-400">
                                        <CheckCircle className="h-8 w-8 mb-2" />
                                        <p>No completed tasks</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CentralBankDashboard;
