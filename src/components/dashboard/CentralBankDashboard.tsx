// src/components/dashboard/CentralBankDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Banknote, Shield, Activity, Clock, CheckCircle, Inbox as InboxIcon, Info, TrendingUp, BarChart } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
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

    // Fetch system data from localStorage
    const [systemData, setSystemData] = useState<any>(null);
    const [totalMinted, setTotalMinted] = useState<number>(0);
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

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

    useEffect(() => {
        const stored = localStorage.getItem('users');
        const users = stored ? JSON.parse(stored) : [];
        const system = users.find((u: any) => u.id === 'system') || { totalMinted: 1_000_000 };
        setSystemData(system);
        setTotalMinted(system.totalMinted);
    }, []);

    // Fetch live supply from Supabase
    useEffect(() => {
        const fetchSupply = async () => {
            const { data, error } = await supabase.from('TokenSupply').select('total_minted');
            if (error) {
                console.error('Error fetching token supply:', error);
                return;
            }
            setTotalMinted(data?.[0]?.total_minted || 0);
        };

        fetchSupply();
    }, []);

    // Demo-derived metrics
    const connectedBanknotes = 5_800_000; // e.g. physical banknotes tracked
    const centralHoldingsDemo = 750_000; // demo digital holdings
    const withoutConnectedBanknotes = 400_000; // demo other holdings

    // Map to display variables
    const digitalCbdcInCirculation = centralHoldingsDemo;
    const fiatInCirculation = connectedBanknotes;
    const centralBankHoldings = withoutConnectedBanknotes;
    const totalCBDC = totalMinted;

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

    return (
        <DashboardLayout activePage="dashboard" userName={currentUser?.name || 'Central Bank'} userAvatar={currentUser?.avatar || ''}>
            <div className="space-y-8 pb-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Central Bank Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Overview of CBDC operations and liquidity</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                            <Activity className="h-4 w-4 mr-1" /> System Online
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            <Clock className="h-4 w-4 mr-1" /> Last Updated: Just now
                        </Badge>
                    </div>
                </div>

                {/* Summary Metrics */}
                <Card className="bg-white border border-gray-200 shadow-md">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#1f0d68] tracking-tight">
                                {formatCurrency(totalMinted + digitalCbdcInCirculation + fiatInCirculation + centralBankHoldings)}
                            </h2>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-5 w-5 text-muted-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">Overview of key CBDC metrics</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Group */}
                            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2">
                                {/* Token Supply and Liquidity */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
                                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-5 w-5 text-primary" />
                                                <span className="ml-2 text-sm font-medium">Token Supply and Liquidity</span>
                                            </div>
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalCBDC)}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">+3.2% MoM</div>
                                    </div>
                                </motion.div>

                                {/* Central Holdings */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
                                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-5 w-5 text-blue-500" />
                                                <span className="ml-2 text-sm font-medium">
                                                    Central Holdings
                                                    <span
                                                        className="ml-2 text-[7px] text-[#1f0d68] bg-muted px-1.5 py-0.5 rounded uppercase cursor-help"
                                                        title="This is a demo metric"
                                                    >
                                                        demo
                                                    </span>
                                                </span>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(digitalCbdcInCirculation)}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">+2.1% MoM</div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="hidden lg:block w-px bg-gray-300 mx-2" />

                            {/* Right Group */}
                            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2">
                                {/* Connected Banknotes */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
                                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-5 w-5 text-amber-500" />
                                                <span className="ml-2 text-sm font-medium">
                                                    Connected Banknotes
                                                    <span
                                                        className="ml-2 text-[7px] text-[#1f0d68] bg-muted px-1.5 py-0.5 rounded uppercase cursor-help"
                                                        title="This is a demo metric"
                                                    >
                                                        demo
                                                    </span>
                                                </span>
                                            </div>
                                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(fiatInCirculation)}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">-0.8% MoM</div>
                                    </div>
                                </motion.div>

                                {/* Without Connected Banknotes */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
                                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-700">
                                                <Banknote className="h-5 w-5 text-purple-500" />
                                                <span className="ml-2 text-sm font-medium">
                                                    Without Connected Banknotes
                                                    <span
                                                        className="ml-2 text-[7px] text-[#1f0d68] bg-muted px-1.5 py-0.5 rounded uppercase cursor-help"
                                                        title="This is a demo metric"
                                                    >
                                                        demo
                                                    </span>
                                                </span>
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(centralBankHoldings)}</div>
                                        <div className="mt-1 text-xs text-muted-foreground">+1.5% MoM</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="font-semibold">Liquidity Trends</CardTitle>
                                    <CardDescription>6-month historical data</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    <BarChart className="h-4 w-4 mr-1" /> View Details
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="h-56 w-full flex items-end justify-around px-4 pb-4">
                                {[65, 40, 75, 50, 85, 60].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center group">
                                        <div
                                            className="w-6 bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100">
                                                {formatCurrency(h * 10000)}
                                            </div>
                                        </div>
                                        <span className="mt-2 text-xs text-muted-foreground">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-sm">Demo data</div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="font-semibold">Transaction Activity</CardTitle>
                                    <CardDescription>Monthly volume analysis</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">
                                    <BarChart className="h-4 w-4 mr-1" /> View Details
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="h-56 w-full flex items-end justify-around px-4 pb-4">
                                {[65, 40, 75, 50, 85, 60].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center group">
                                        <div
                                            className="w-6 bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100">
                                                {formatCurrency(h * 10000)}
                                            </div>
                                        </div>
                                        <span className="mt-2 text-xs text-muted-foreground">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-sm">Demo data</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Connected Banknotes Breakdown */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b pb-3 flex justify-between items-center">
                            <CardTitle className="font-semibold">Connected Banknotes</CardTitle>
                            <Badge variant="secondary" className="font-normal">
                                {formatCurrency(digitalCbdcInCirculation)} in circulation
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Denomination', value: 500_000, pct: 75 },
                                    { label: 'Issued', value: 450_000, pct: 65 },
                                    { label: 'Redeemed', value: 300_000, pct: 45 },
                                ].map((b) => (
                                    <div key={b.label} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">{b.label}</h3>
                                        <div className="text-xl font-semibold mb-2">{formatCurrency(b.value)}</div>
                                        <Progress value={b.pct} className="h-1 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-sm">Demo data</div>
                        </CardContent>
                    </Card>

                    {/* Tasks & Approvals */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b flex justify-between items-center pb-3">
                            <CardTitle className="font-semibold">Tasks & Approvals</CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <Tabs defaultValue="todo">
                                <TabsList className="grid grid-cols-3 mb-4">
                                    <TabsTrigger value="todo">To Do</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="done">Completed</TabsTrigger>
                                </TabsList>
                                <TabsContent value="todo">
                                    <div className="space-y-4">
                                        {tasks.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">{t.icon}</div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-800">{t.title}</h4>
                                                        <p className="text-xs text-gray-500">{t.subtitle}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className={`${t.badgeColor}`}>
                                                    {t.badge}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="pending">
                                    {pendingApprovals.length > 0 ? (
                                        <div className="space-y-4">
                                            {pendingApprovals.map((n) => (
                                                <div key={n.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                                            <Banknote className="h-5 w-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-800">{n.message}</h4>
                                                            <p className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                                                        Pending
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-12 text-gray-400">
                                            <Clock className="h-8 w-8 mb-2" />
                                            <p>No pending approvals</p>
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
                            <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-sm">Demo data</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CentralBankDashboard;
