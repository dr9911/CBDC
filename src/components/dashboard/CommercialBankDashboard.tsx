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
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold">Commercial Bank Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Banknote className="text-blue-500 bg-blue-100 p-1 rounded-full" size={24} />
                                Total CBDC Holding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">1,250,000 TND</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <TrendingUp className="text-green-500 bg-green-100 p-1 rounded-full" size={24} />
                                Transfers Processed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">8,000</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Users className="text-purple-500 bg-purple-100 p-1 rounded-full" size={24} />
                                Retail Customers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-800">12,300</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle>CBDC Wallet Value Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56 relative">
                                <Doughnut
                                    data={donutData}
                                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
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

                    <Card className="hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle>CBDC Transactions Volume (Last 6 Months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-70 flex items-center justify-center">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        {tasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">{task.icon}</div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800">{task.title}</h4>
                                                        <p className="text-xs text-gray-500">{task.description}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="pending">
                                    <div className="flex flex-col items-center py-12 text-gray-400">
                                        <Clock className="h-8 w-8 mb-2" />
                                        <p>No pending approvals</p>
                                    </div>
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

export default CommercialBankDashboard;
