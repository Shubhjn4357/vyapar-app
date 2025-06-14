import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchProfileApi, loginApi, registerApi, requestOTP, resetPassword, verifyOTP, completeProfileApi } from "../api/auth";
import * as SecureStore from "expo-secure-store";
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { User } from "../types/user";
import { Company } from "../types/company";
import { Platform } from "react-native";
import * as Device from 'expo-device';

type AuthState = {
    user: User | null;
    token: string | null;
    company: Company | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    authMethod: 'email' | 'google' | 'facebook' | 'guest' | null;
};

type AuthContextType = AuthState & {
    setCompany: (c: Company | null) => void;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    login: (token: string, user: User) => Promise<void>;
    resetPassword: (mobile: string, otp: string, password: string) => Promise<void>;
    register: (data: { name: string; mobile: string; email: string; password: string }) => Promise<void>;
    forgotPassword: (mobile: string) => Promise<string>;
    verifyOtp: (mobile: string, otp: string, otpId: string) => Promise<any>;
    completeProfile: (profileData: { name?: string; email?: string }) => Promise<void>;
    completeRegistration: (token: string, user: User) => Promise<void>;
    clearError: () => void;
    // New authentication methods
    loginAsGuest: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    sendEmailOTP: (email: string) => Promise<void>;
    sendSMSOTP: (mobile: string) => Promise<void>;
    verifyEmailOTP: (email: string, otp: string) => Promise<void>;
    verifyMobileOTP: (mobile: string, otp: string) => Promise<{ token: string; user: User; isNewUser: boolean }>;
    convertGuestToUser: (data: { name: string; email?: string; mobile?: string; password?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        company: null,
        isLoading: true,
        error: null,
        isAuthenticated: false,
        isGuest: false,
        authMethod: null
    });

    // Google OAuth configuration
    const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        clientId: Platform.select({
            ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
            android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
            web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        }),
    });

    // Facebook OAuth configuration
    const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
    });

    const setError = (error: string | null) =>
        setState(prev => ({ ...prev, error, isLoading: false }));

    const clearError = () => setError(null);

    const refreshToken = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) throw new Error("No token found");
            const userProfile = await fetchProfileApi(token);
            
            setState(prev => ({
                ...prev,
                token,
                user: userProfile,
                isAuthenticated: true,
                isLoading: false,
                error: null
            }));
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to refresh token");
            logout();
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                setState(prev => ({ ...prev, token }));
                try {
                    const userProfile = await fetchProfileApi(token);
                    setState(prev => ({
                        ...prev,
                        user: userProfile,
                        isAuthenticated: true,
                        isLoading: false
                    }));
                } catch (error) {
                    setError(error instanceof Error ? error.message : "Failed to load profile");
                }
                finally{
                    setState(prev=>({...prev,isLoading:false}))
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };
        loadUserData();
    }, []);
    const resetPasswordHandler = useCallback(async (mobile: string, otp: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await resetPassword(mobile, "", password, otp);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "Failed to reset password");
            throw error;
        }
    }, []);
    const login = useCallback(async (token: string, user: User) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await SecureStore.setItemAsync("token", token);
            setState(prev => ({
                ...prev,
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Login failed");
            throw error;
        }
    }, []);

    const completeRegistration = useCallback(async (token: string, user: User) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await SecureStore.setItemAsync("token", token);
            setState(prev => ({
                ...prev,
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Registration completion failed");
            throw error;
        }
    }, []);

    const register = useCallback(async (data: { name: string; mobile: string; email: string; password: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await registerApi(data);
            await SecureStore.setItemAsync("token", response.token);
            setState(prev => ({
                ...prev,
                token: response.token,
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Registration failed");
            throw error;
        }
    }, []);

    const forgotPassword = useCallback(async (mobile: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response=await requestOTP(mobile);
            setState(prev => ({ ...prev, isLoading: false }));
            return response.data.otpId
        } catch (error: any) {
            setError(error?.message || "Failed to send OTP");
            throw error;
        }
    }, []);

    const verifyOtp = useCallback(async (mobile: string, otp: string, otpId: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await verifyOTP(mobile, otp, otpId);
            setState(prev => ({ ...prev, isLoading: false }));
            return response;
        } catch (error: any) {
            setError(error?.message || "OTP verification failed");
            throw error;
        }
    }, []);

    const completeProfile = useCallback(async (profileData: { name?: string; email?: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            if (!state.token) throw new Error("No token found");
            const updatedUser = await completeProfileApi(state.token, profileData);
            setState(prev => ({
                ...prev,
                user: updatedUser,
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Failed to complete profile");
            throw error;
        }
    }, [state.token]);

    // New authentication methods
    const loginAsGuest = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const deviceId = Device.osInternalBuildId || `${Platform.OS}_${Date.now()}`;
            const deviceInfo = {
                platform: Platform.OS,
                version: Platform.Version.toString(),
                model: Device.modelName || 'Unknown'
            };

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, deviceInfo })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            await SecureStore.setItemAsync("token", data.data.token);
            setState(prev => ({
                ...prev,
                token: data.data.token,
                user: data.data.user,
                isAuthenticated: true,
                isGuest: true,
                authMethod: 'guest',
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Guest login failed");
            throw error;
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await googlePromptAsync();
            if (result?.type === 'success' && result.authentication?.idToken) {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/google/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: result.authentication.idToken })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                await SecureStore.setItemAsync("token", data.data.token);
                setState(prev => ({
                    ...prev,
                    token: data.data.token,
                    user: data.data.user,
                    isAuthenticated: true,
                    isGuest: false,
                    authMethod: 'google',
                    isLoading: false,
                    error: null
                }));
            } else {
                throw new Error('Google authentication cancelled');
            }
        } catch (error: any) {
            setError(error?.message || "Google login failed");
            throw error;
        }
    }, [googlePromptAsync]);

    const loginWithFacebook = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const result = await facebookPromptAsync();
            if (result?.type === 'success' && result.authentication?.accessToken) {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/facebook/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessToken: result.authentication.accessToken })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message);

                await SecureStore.setItemAsync("token", data.data.token);
                setState(prev => ({
                    ...prev,
                    token: data.data.token,
                    user: data.data.user,
                    isAuthenticated: true,
                    isGuest: false,
                    authMethod: 'facebook',
                    isLoading: false,
                    error: null
                }));
            } else {
                throw new Error('Facebook authentication cancelled');
            }
        } catch (error: any) {
            setError(error?.message || "Facebook login failed");
            throw error;
        }
    }, [facebookPromptAsync]);

    const sendEmailOTP = useCallback(async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/otp/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "Failed to send email OTP");
            throw error;
        }
    }, []);

    const sendSMSOTP = useCallback(async (mobile: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/otp/send-sms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "Failed to send SMS OTP");
            throw error;
        }
    }, []);

    const verifyEmailOTP = useCallback(async (email: string, otp: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/otp/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "Email OTP verification failed");
            throw error;
        }
    }, []);

    const verifyMobileOTP = useCallback(async (mobile: string, otp: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/otp/verify-mobile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            await SecureStore.setItemAsync("token", data.data.token);
            setState(prev => ({
                ...prev,
                token: data.data.token,
                user: data.data.user,
                isAuthenticated: true,
                isGuest: false,
                authMethod: 'email',
                isLoading: false,
                error: null
            }));

            return data.data;
        } catch (error: any) {
            setError(error?.message || "Mobile OTP verification failed");
            throw error;
        }
    }, []);

    const convertGuestToUser = useCallback(async (data: { name: string; email?: string; mobile?: string; password?: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            if (!state.token) throw new Error("No token found");

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/convert-guest`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message);

            await SecureStore.setItemAsync("token", responseData.data.token);
            setState(prev => ({
                ...prev,
                token: responseData.data.token,
                user: responseData.data.user,
                isGuest: false,
                authMethod: 'email',
                isLoading: false,
                error: null
            }));
        } catch (error: any) {
            setError(error?.message || "Failed to convert guest account");
            throw error;
        }
    }, [state.token]);

    const logout = async () => {
        setState(prev => ({ 
            ...prev, 
            token: null, 
            user: null, 
            company: null, 
            isAuthenticated: false,
            isGuest: false,
            authMethod: null
        }));
        await SecureStore.deleteItemAsync("token");
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            setCompany: (c) => setState(prev => ({ ...prev, company: c })),
            logout,
            refreshToken,
            login,
            register,
            forgotPassword,
            resetPassword: resetPasswordHandler,
            verifyOtp,
            completeProfile,
            completeRegistration,
            clearError,
            // New methods
            loginAsGuest,
            loginWithGoogle,
            loginWithFacebook,
            sendEmailOTP,
            sendSMSOTP,
            verifyEmailOTP,
            verifyMobileOTP,
            convertGuestToUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};