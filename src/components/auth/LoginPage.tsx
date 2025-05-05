// src/components/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Use whatever logic you have for selecting or defaulting the username
            const loginUsername = username;

            const success = await login(loginUsername, password);

            if (success) {
                // Read the freshly‑stored user object
                const stored = localStorage.getItem('dualUser');
                const { role: userType } = stored ? JSON.parse(stored) : { role: 'user' };

                // Route based on the actual role
                switch (userType) {
                    case 'central_bank':
                        navigate('/dashboard');
                        break;
                    case 'commercial_bank':
                        navigate('/commercial');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">TND Platform</CardTitle>
                    <CardDescription>Sign in to access the CBDC Dashboard</CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <div className="text-center w-full">
                        <p>For demo purposes, you can leave fields empty to use default credentials</p>
                    </div>
                    <div className="text-center w-full">
                        <p>© 2025 TND Platform. All rights reserved.</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
