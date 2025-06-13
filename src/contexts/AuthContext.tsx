import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchProfileApi, loginApi, registerApi, requestOTP, resetPasswordApi, verifyOTP } from "../api/auth";
import * as SecureStore from "expo-secure-store";
import { User } from "../types/user";
import { Company } from "../types/company";

type AuthState = {
    user: User | null;
    token: string | null;
    company: Company | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
    setCompany: (c: Company | null) => void;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    login: (mobile: string, password: string) => Promise<void>;
    resetPassword: (mobile: string, otp: string, password: string) => Promise<void>;
    register: (data: { name: string; mobile: string; email: string; password: string }) => Promise<void>;
    forgotPassword: (mobile: string) => Promise<string>;
    verifyOtp: (mobile: string, otp: string) => Promise<void>;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        company: null,
        isLoading: true,
        error: null,
        isAuthenticated: false
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
    const resetPassword = useCallback(async (mobile: string, otp: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await resetPasswordApi(mobile, password,otp);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "Failed to reset password");
            throw error;
        }
    }, []);
    const login = useCallback(async (mobile: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const response = await loginApi(mobile, password);
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
            setError(error?.message || "Login failed");
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
            return response.otpId
        } catch (error: any) {
            setError(error?.message || "Failed to send OTP");
            throw error;
        }
    }, []);

    const verifyOtp = useCallback(async (mobile: string, otp: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            await verifyOTP(mobile, otp);
            setState(prev => ({ ...prev, isLoading: false }));
        } catch (error: any) {
            setError(error?.message || "OTP verification failed");
            throw error;
        }
    }, []);

    const logout = async () => {
        setState(prev => ({ ...prev, token: null, user: null, company: null, isAuthenticated: false }));
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
            resetPassword,
            verifyOtp,
            clearError
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