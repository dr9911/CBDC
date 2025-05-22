import { supabase } from '@/utils/supabase';

export const sendOtpToEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
        console.error('❌ Error sending OTP:', error.message);
        throw new Error('Failed to send OTP.');
    }

    console.log(`✅ OTP sent to ${email}`);
};

export const verifyOtp = async (email: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'magiclink',
    });

    if (error) {
        console.error('❌ OTP verification failed:', error.message);
        throw new Error('Invalid OTP. Please try again.');
    }

    console.log('✅ OTP Verified');
};
