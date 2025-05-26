// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import routes from 'tempo-routes';
import { Toaster } from 'sonner';

const CentralBankDashboard = lazy(() => import('./components/dashboard/CentralBankDashboard'));
const CommercialBankDashboard = lazy(() => import('./components/dashboard/CommercialBankDashboard'));
const MintNewSupply = lazy(() => import('./components/minting/MintNewSupply'));
const AccountsPage = lazy(() => import('./components/accounts/AccountsPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const HistoryPage = lazy(() => import('./components/history/HistoryPage'));
const MintApproval = lazy(() => import('./components/minting/MintApproval'));
const Transfer = lazy(() => import('./components/dashboard/Transfer'));
const Home = lazy(() => import('./components/home'));

function LoadingScreen({ title = 'Loading Dashboard', message = 'Preparing your personalized view...' }: { title?: string; message?: string }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

function App() {
    console.log('Loading App with user:');
    const { isAuthenticated, currentUser } = useAuth();

    const getRedirectPath = () => {
        if (currentUser?.role === 'central_bank') return '/dashboard';
        if (currentUser?.role === 'commercial_bank') return '/commercial';
        return '/home';
    };

    return (
        <>
            <Toaster position="top-center" duration={3000} richColors closeButton />

            <Suspense fallback={<LoadingScreen title="Loading App" message="Hang tight, we're almost there..." />}>
                {/* Tempo routes - must be before other routes to work properly */}
                {import.meta.env.VITE_TEMPO === 'true' && useRoutes(routes)}

                <Routes>
                    {/* PUBLIC */}
                    <Route path="/login" element={isAuthenticated ? <Navigate to={getRedirectPath()} replace /> : <LoginPage />} />

                    {/* ROOT REDIRECT */}
                    <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />

                    {/* HOME ROUTE */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Suspense fallback={<LoadingScreen title="Loading Home" />}>
                                    <Home />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* CENTRAL BANK DASHBOARD */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole="central_bank">
                                <Suspense fallback={<LoadingScreen />}>
                                    <CentralBankDashboard />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* COMMERCIAL BANK DASHBOARD */}
                    <Route
                        path="/commercial"
                        element={
                            <ProtectedRoute requiredRole="commercial_bank">
                                <Suspense fallback={<LoadingScreen title="Loading Commercial Bank Dashboard" />}>
                                    <CommercialBankDashboard />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* CENTRAL BANK ONLY ROUTES */}
                    <Route
                        path="/mint"
                        element={
                            <ProtectedRoute requiredRole="central_bank">
                                <MintNewSupply />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/mint/approval"
                        element={
                            <ProtectedRoute requiredRole="central_bank">
                                <MintApproval />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transfer"
                        element={
                            <ProtectedRoute requiredRole="central_bank">
                                <Transfer />
                            </ProtectedRoute>
                        }
                    />

                    {/* HISTORY (SHARED) */}
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <HistoryPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* USER-ONLY ACCOUNTS */}
                    <Route
                        path="/accounts"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <AccountsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROFILE & SETTINGS */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* CATCH-ALL */}
                    <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
