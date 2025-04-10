import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // const [userType, setUserType] = useState('user'); // Default to regular user

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // In a real app, we would use the selected user type
            // For demo, we're using predefined usernames
            let loginUsername = username;

            // // If no username is provided, use the default for the selected role
            // if (!username) {
            //     switch (userType) {
            //         case 'central_bank':
            //             loginUsername = 'central_bank';
            //             break;
            //         case 'commercial_bank':
            //             loginUsername = 'commercial_bank';
            //             break;
            //         default:
            //             loginUsername = 'user';
            //     }
            // }

            const success = await login(loginUsername, password);
            // console.log('Login success:', success);

            if (success) {
                // Redirect based on user type
                // const currentUser = JSON.parse(localStorage.getItem('dualUser') || '{}');
                const { currentUser } = useAuth();
                const userType = currentUser.role;
                switch (userType) {
                    case 'central_bank':
                        navigate('/mint');
                        break;
                    case 'commercial_bank':
                        navigate('/accounts');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error(err);
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

                {/* <Tabs defaultValue="user" onValueChange={setUserType}> */}
                {/* <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="user" className="flex items-center justify-center">
                            <User className="mr-2 h-4 w-4" />
                            User
                        </TabsTrigger>
                        <TabsTrigger value="commercial_bank" className="flex items-center justify-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Commercial Bank
                        </TabsTrigger>
                        <TabsTrigger value="central_bank" className="flex items-center justify-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Central Bank
                        </TabsTrigger>
                    </TabsList> */}

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
                                <Input id="username" placeholder={`Enter username`} value={username} onChange={(e) => setUsername(e.target.value)} />
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
                {/* </Tabs> */}

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
