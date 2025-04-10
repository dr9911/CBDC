import { User, UserRole } from '@/types/auth';
import { supabase } from '@/utils/supabase';

// In a real app, we would use a proper hashing library like bcrypt


export async function authenticateUser(email: string, password: string) {
    // We have to check whether email exist in the database or not
    const { data, error } = await supabase.from('Users').select('*');
  
    localStorage.setItem('users', JSON.stringify(data));

    const user = (data as User[]).find((u) => u.email === email);
    console.log('User:', user);
    // also we update last login time of this user in the database
    if (user) {
        const {data, error} = await supabase.from('Users').update({ last_login: new Date() }).eq('id', user.id);
        if (error) {
            console.error('Error updating last login:', error);
        }
        console.log('Last login updated:', data);
    }

    if (!user) {
        return null;
    }
    return user;
}

export function hasPermission(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return false;

    // Role hierarchy: central_bank > commercial_bank > user
    if (user.role === 'central_bank') return true;
    if (user.role === 'commercial_bank' && requiredRole !== 'central_bank') return true;
    if (user.role === 'user' && requiredRole === 'user') return true;

    return false;
}

