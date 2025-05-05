// src/components/dashboard/CommercialBankDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Banknote, TrendingUp, Users, Plus, Repeat, Bell, CreditCard, ArrowDown, ArrowUp, PieChart } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Inbox as InboxIcon } from 'lucide-react';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CommercialBankDashboard = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('Notifications')
                .select('*')
                .eq('user_id', currentUser?.id || '')
                .order('created_at', { ascending: false });

            if (!error) setNotifications(data);
        };
        fetchNotifications();
    }, [currentUser?.id]);

    const [commercialBankHoldings, setCommercialBankHoldings] = useState<number>(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchBankHoldings = async () => {
            if (!currentUser?.id) return;

            const { data, error } = await supabase.from('Users').select('balance').eq('id', currentUser.id).single(); // since we're fetching only one row

            if (error) {
                console.error('Error fetching bank balance:', error);
                return;
            }
            setCommercialBankHoldings(data?.balance || 0);
        };

        fetchBankHoldings();
    }, [currentUser?.id]);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (!currentUser?.id) return;

            const { data, error } = await supabase
                .from('Transactions')
                .select('type, amount, status, sender, receiver')
                .or(`sender.eq.${currentUser.id},receiver.eq.${currentUser.id}`)
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) {
                console.error('Error fetching user transactions:', error);
                return;
            }

            setRecentTransactions(data || []);
        };

        fetchRecentTransactions();
    }, [currentUser?.id]);

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
                label: 'CBDC Customer Distribution',
                data: [400000, 300000, 200000],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 1,
            },
        ],
        labels: ['Retail Customers', 'Corporate Customers', 'Gov Accounts'],
    };

    // Define tasks array to fix the 'tasks is not defined' error
    const tasks = [
        {
            id: 1,
            title: 'Verify Customer Onboarding',
            description: 'New user awaiting verification',
            priority: 'High',
            icon: <InboxIcon className="h-5 w-5 text-indigo-600" />,
        },
        {
            id: 2,
            title: 'Review Transaction Limits',
            description: 'Quarterly review required',
            priority: 'Medium',
            icon: <CreditCard className="h-5 w-5 text-blue-600" />,
        },
    ];

    return (
        <DashboardLayout activePage="dashboard">
            <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Commercial Bank Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 sm:gap-3">
                                <Banknote className="text-blue-500 bg-blue-100 p-1 rounded-full" size={20} />
                                Total CBDC Holding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                                {new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(
                                    commercialBankHoldings
                                )}{' '}
                                CBDC
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all relative">
                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                            demo
                        </span>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 sm:gap-3">
                                <TrendingUp className="text-green-500 bg-green-100 p-1 rounded-full" size={20} />
                                Transfers Processed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">8,000</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all relative">
                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                            demo
                        </span>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 sm:gap-3">
                                <Users className="text-purple-500 bg-purple-100 p-1 rounded-full" size={20} />
                                Retail Customers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800">12,300</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="hover:shadow-xl transition-all relative">
                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                            demo
                        </span>
                        <CardHeader>
                            <CardTitle>Commercial Bank CBDC Wallet Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full h-[180px] sm:h-[220px] md:h-[240px] lg:h-[260px] mt-4">
                                <Doughnut
                                    data={donutData}
                                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                                />
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8">
                                {donutData.labels.map((label, index) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                                            style={{ backgroundColor: donutData.datasets[0].backgroundColor[index] }}
                                        />
                                        <span className="text-xs sm:text-sm text-gray-600">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all relative">
                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                            demo
                        </span>
                        <CardHeader>
                            <CardTitle>CBDC Transactions Volume (Last 6 Months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Responsive chart container with fixed aspect ratio */}
                            <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                                <Line
                                    data={chartData}
                                    options={{ ...chartOptions, responsive: true, maintainAspectRatio: false }}
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions and Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="hover:shadow-xl transition-all overflow-x-auto">
                        <CardHeader>
                            <CardTitle className="text-sm sm:text-base">Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm md:text-base min-w-[350px]">
                                    <thead>
                                        <tr className="text-left text-gray-500 border-b">
                                            <th className="py-2">Type</th>
                                            <th className="py-2">Amount</th>
                                            <th className="py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentTransactions.map((tx, index) => {
                                            let label = 'Sent';
                                            let icon = <ArrowUp className="text-green-500" size={16} />;

                                            switch (tx.type) {
                                                case 'user_to_user':
                                                case 'commercial_bank_to_user':
                                                case 'commercial_bank_to_commercial_bank':
                                                    label = 'Sent';
                                                    icon = <ArrowUp className="text-green-500" size={16} />;
                                                    break;
                                                case 'central_bank_to_user':
                                                case 'central_bank_to_commercial_bank':
                                                    label = 'Received';
                                                    icon = <ArrowDown className="text-blue-500" size={16} />;
                                                    break;
                                                default:
                                                    label = 'Sent';
                                                    icon = <Repeat className="text-gray-500" size={16} />;
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td className="py-2 flex items-center gap-2">
                                                        {icon}
                                                        <span>{label}</span>
                                                    </td>
                                                    <td className="py-2">{Number(tx.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })} CBDC</td>
                                                    <td className={`py-2 font-medium ${tx.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm relative">
                        <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300 uppercase tracking-wide">
                            demo
                        </span>
                        <CardHeader className="bg-gray-50 border-b flex justify-between items-center p-2 sm:p-3">
                            <CardTitle className="text-sm sm:text-base font-semibold">Tasks & Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="todo" className="space-y-2 sm:space-y-4">
                                <TabsList className="grid grid-cols-3 mb-2 sm:mb-4">
                                    <TabsTrigger value="todo" className="text-xs sm:text-sm">
                                        To Do
                                    </TabsTrigger>
                                    <TabsTrigger value="pending" className="text-xs sm:text-sm">
                                        Pending
                                    </TabsTrigger>
                                    <TabsTrigger value="done" className="text-xs sm:text-sm">
                                        Completed
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="todo">
                                    <div className="space-y-2 sm:space-y-4">
                                        {tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 sm:mr-3">
                                                        {task.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs sm:text-sm font-medium text-gray-800">{task.title}</h4>
                                                        <p className="text-[10px] sm:text-xs text-gray-500">{task.description}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200 text-xs sm:text-sm">
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="pending">
                                    <div className="flex flex-col items-center py-8 sm:py-12 text-gray-400">
                                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                                        <p className="text-xs sm:text-sm">No pending approvals</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="done">
                                    <div className="flex flex-col items-center py-8 sm:py-12 text-gray-400">
                                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
                                        <p className="text-xs sm:text-sm">No completed tasks</p>
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

export default CommercialBankDashboard;
