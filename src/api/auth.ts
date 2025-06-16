import { client } from './client';
import { ApiError } from './errors';
import { User } from '../types/user';
import { ApiResponse } from '../types/api';

export const loginApi = async (mobile: string, password: string): Promise<{token: string, user: User}> => {
    try {
        const { data } = await client.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
            mobile,
            password
        });
        return data.data;
    } catch (error) {
        console.log(error)
        throw new ApiError('Login failed', error);
    }
};
export const resetPassword = async (mobile: string, token: string, password: string, otpId: string): Promise<{ status: string; message: string }> => {
    try {
        const { data } = await client.post<ApiResponse<{ status: string; message: string }>>('/auth/reset-password', {
            mobile,
            token,
            password,
            otpId
        });
        return data.data;
    } catch (error) {
        throw new ApiError('Reset password failed', error);
    }
};
export const registerApi = async (data: {
    mobile: string;
    email?: string;
    password: string;
    name?: string;
}): Promise<{token: string, user: User}> => {
    try {
        const { data: response } = await client.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data);
        return response.data;
    } catch (error) {
        console.log(error)
        throw new ApiError('Registration failed', error);
    }
};

export const logoutApi = async (token: string): Promise<void> => {
    // Implement if needed
};

export const googleLoginApi = async (googleId: string, email: string, name?: string, phone?: string): Promise<{token: string, user: User}> => {
    try {
        const { data } = await client.post<ApiResponse<{ token: string; user: User }>>('/auth/google', { googleId, email, name, phone });
        return data.data;
    } catch (error) {
        throw new ApiError('Google login failed', error);
    }
};

export const facebookLogin = async (accessToken: string): Promise<{token: string, user: User, isNewUser?: boolean, socialProfile?: any}> => {
    try {
        const { data } = await client.post<ApiResponse<{ token: string; user: User; isNewUser?: boolean; socialProfile?: any }>>('/auth/facebook', { accessToken });
        return data.data;
    } catch (error) {
        throw new ApiError('Facebook login failed', error);
    }
};

export const fetchProfileApi = async (token:string): Promise<User> => {
    try {
        const { data } = await client.get<ApiResponse<User>>('/user/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        console.log({error})
        throw new ApiError('Failed to fetch profile', error);
    }
};

export const requestOTP = async (mobile: string): Promise<{ otpId: string; expiresAt: string }> => {
    try {
        const { data } = await client.post<ApiResponse<{ otpId: string; expiresAt: string }>>('/auth/otp/request', { mobile });
        return data.data;
    } catch (error) {
        throw new ApiError('Failed to send OTP', error);
    }
};

export const verifyOTP = async (mobile: string, otp: string, otpId: string): Promise<{ token: string; user: User; resetToken?: string }> => {
    try {
        const { data } = await client.post<ApiResponse<{ token: string; user: User; resetToken?: string }>>('/auth/otp/verify', {
            mobile,
            otp,
            otpId
        });
        return data.data;
    } catch (error) {
        throw new ApiError('OTP verification failed', error);
    }
};

export const refreshToken = async (token: string): Promise<{ token: string; expiresAt: string }> => {
    try {
        const { data } = await client.post<ApiResponse<{ token: string; expiresAt: string }>>('/auth/refresh', { token });
        return data.data;
    } catch (error) {
        throw new ApiError('Failed to refresh token', error);
    }
};

export const completeProfileApi = async (token: string, profileData: {
    name?: string;
    email?: string;
}): Promise<User> => {
    try {
        const { data } = await client.put<ApiResponse<User>>('/user/me/profile', profileData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        throw new ApiError('Failed to complete profile', error);
    }
};

