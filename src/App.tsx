// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './components/home';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import routes from 'tempo-routes';
import { Toaster } from 'sonner';

const CentralBankDashboard = lazy(() => import('./components/dashboard/CentralBankDashboard'));
const MintNewSupply = lazy(() => import('./components/minting/MintNewSupply'));
const AccountsPage = lazy(() => import('./components/accounts/AccountsPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const HistoryPage = lazy(() => import('./components/history/HistoryPage'));
const MintApproval = lazy(() => import('./components/minting/MintApproval'));
const Transfer = lazy(() => import('./components/dashboard/Transfer'));

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
    const { isAuthenticated, currentUser } = useAuth();
    return (
        <>
            <Toaster position="top-center" duration={3000} richColors closeButton />

            <Suspense fallback={<LoadingScreen title="Loading App" message="Hang tight, we're almost there..." />}>
                <Routes>
                    {/* — PUBLIC — */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate
                                    to={currentUser?.role === 'central_bank' ? '/dashboard' : currentUser?.role === 'commercial_bank' ? '/accounts' : '/'}
                                    replace
                                />
                            ) : (
                                <LoginPage />
                            )
                        }
                    />

                    {/* — ROOT — */}
                    <Route
                        path="/"
                        element={<ProtectedRoute>{currentUser?.role === 'central_bank' ? <Navigate to="/dashboard" replace /> : <Home />}</ProtectedRoute>}
                    />

                    {/* — DASHBOARD — */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Suspense fallback={<LoadingScreen />}>{currentUser?.role === 'central_bank' ? <CentralBankDashboard /> : <Home />}</Suspense>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/transfer"
                        element={
                            <ProtectedRoute>
                                <Suspense fallback={<LoadingScreen />}>{currentUser?.role === 'central_bank' ? <Transfer /> : <Home />}</Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* — HISTORY — */}
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <HistoryPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* — CENTRAL BANK ONLY ROUTES — */}
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

                    {/* — COMMERCIAL / USER ACCOUNTS — */}
                    <Route
                        path="/accounts"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <AccountsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* — PROFILE & SETTINGS — */}
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

                    {/* — CATCH‑ALL — */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {import.meta.env.VITE_TEMPO === 'true' && useRoutes(routes)}
            </Suspense>
        </>
    );
}

export default App;
