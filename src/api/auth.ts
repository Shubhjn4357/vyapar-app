import { client } from './client';
import { ApiError } from './errors';
import { User } from '../types/user';

interface AuthResponse {
    token: string;
    user: User;
}

interface OTPResponse {
    otpId: string;
    expiresAt: string;
}

interface VerifyOTPResponse extends AuthResponse {
    isNewUser: boolean;
}

interface RefreshTokenResponse {
    token: string;
    expiresAt: string;
}

interface SocialAuthResponse extends AuthResponse {
    isNewUser: boolean;
    socialProfile?: {
        id: string;
        email?: string;
        name?: string;
        picture?: string;
        phone?: string;
    };
}

export const loginApi = async (mobile: string, password: string): Promise<AuthResponse> => {
    try {
        const { data } = await client.post<AuthResponse>('/auth/login', {
            mobile,
            password
        });
        return data;
    } catch (error) {
        throw new ApiError('Login failed', error);
    }
};
export const resetPasswordApi= async (mobile: string, password: string,otp:string): Promise<AuthResponse> => {
    try {
        const { data } = await client.post<AuthResponse>('/auth/reset-password', {
            mobile,
            password,
            otp
        });
        return data;
    } catch (error) {
        throw new ApiError('Reset password failed', error);
    }
};
export const registerApi = async (data: {
    mobile: string;
    email?: string;
    password: string;
    name?: string;
}): Promise<AuthResponse> => {
    try {
        const { data: response } = await client.post<AuthResponse>('/auth/register', data);
        return response;
    } catch (error) {
        console.log(error)
        throw new ApiError('Registration failed', error);
    }
};

export const logoutApi = async (token: string): Promise<void> => {
    
};

export const googleLoginApi = async (googleId: string, email: string, name?: string, phone?: string): Promise<AuthResponse> => {
    try {
        const { data } = await client.post<AuthResponse>('/auth/google', { googleId, email, name, phone });
        return data;
    } catch (error) {
        throw new ApiError('Google login failed', error);
    }
};

export const facebookLogin = async (accessToken: string): Promise<SocialAuthResponse> => {
    try {
        const { data } = await client.post<SocialAuthResponse>('/auth/facebook', { accessToken });
        return data;
    } catch (error) {
        throw new ApiError('Facebook login failed', error);
    }
};

export const fetchProfileApi = async (token:string): Promise<User> => {
    try {
        const { data } = await client.get<User>('/user/me?token=' + token);
      
        return data;
    } catch (error) {
        console.log({error})
        throw new ApiError('Failed to fetch profile', error);
    }
};

export const requestOTP = async (mobile: string): Promise<OTPResponse> => {
    try {
        const { data } = await client.post<OTPResponse>('/auth/otp/request', { mobile });
        return data;
    } catch (error) {
        throw new ApiError('Failed to send OTP', error);
    }
};

export const verifyOTP = async (mobile: string, otp: string): Promise<VerifyOTPResponse> => {
    try {
        const { data } = await client.post<VerifyOTPResponse>('/auth/otp/verify', {
            mobile,
            otp
        });
        return data;
    } catch (error) {
        throw new ApiError('OTP verification failed', error);
    }
};

export const refreshToken = async (token: string): Promise<RefreshTokenResponse> => {
    try {
        const { data } = await client.post<RefreshTokenResponse>('/auth/refresh', { token });
        return data;
    } catch (error) {
        throw new ApiError('Failed to refresh token', error);
    }
};


