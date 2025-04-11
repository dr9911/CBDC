import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, Shield, Search } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

const Notification = () => {
    const { currentUser } = useAuth();
    const currentUserId = currentUser?.id;
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // Fetch notifications for the current user
    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('Notifications')
            .select('*')
            .eq('user_id', currentUserId)
            .order('created_at', { ascending: false }); // Sort by latest first

        if (error) {
            console.error('Error fetching notifications:', error);
            return;
        }

        setNotifications(data);
        setNotificationCount(data.length);
    };

    useEffect(() => {
        if (currentUserId) {
            fetchNotifications();
        }
    }, [currentUserId]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {notificationCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                    {notifications.length === 0 ? (
                        <p className="text-center text-muted-foreground">No new notifications</p>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id} className="cursor-pointer">
                                <div className="flex flex-col space-y-1">
                                    <p className="font-medium">{notification.message}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(notification.created_at).toLocaleString()}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-center text-primary">View All Notifications</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notification;
