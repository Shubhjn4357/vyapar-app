import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiError, AuthError } from './errors';
import { ApiResponse } from '../types/api';

const BASE_URL = 'https://vyapar-server.onrender.com/api'; // Change this to your server URL

export const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${SecureStore.getItem('token')}`
    },
    timeout: 10000,
});

client.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => {
        // console.log('client',response.data)
        // Handle new standardized response format: { status: 'success'|'error', data?, message? }
        if (response.data && typeof response.data === 'object') {
            if ('status' in response.data) {
                if (response.data.status === 'error') {
                    throw new ApiError(
                        response.data.message || 'An error occurred',
                        response,
                        response.status
                    );
                }
                // Transform to match ApiResponse interface
                return {
                    ...response,
                    status: response.data.status,
                    data: response.data.data,
                    message: response.data.message
                };
            }
            // Legacy format support
            if ('success' in response.data && 'data' in response.data) {
                return {
                    ...response,
                    status: 'success' as const,
                    data: response.data.data,
                    message: 'Success'
                };
            }
        }
        // For responses without the expected format, wrap in success
        return {
            ...response,
            status: 'success' as const,
            data: response.data,
            message: 'Success'
        };
    },
    (error) => {
        console.log('client', error)
        if (error.response?.status === 401) {
            throw new AuthError('Authentication failed');
        }
        
        // Handle new error format
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'An error occurred';
        
        throw new ApiError(
            errorMessage,
            error,
            error.response?.status
        );
    }
);

// Typed wrapper methods that ensure proper return types
const typedClient = {
    get: <T>(url: string, config?: any): Promise<ApiResponse<T>> => {
        return client.get(url, config);
    },
    post: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        return client.post(url, data, config);
    },
    put: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        return client.put(url, data, config);
    },
    delete: <T>(url: string, config?: any): Promise<ApiResponse<T>> => {
        return client.delete(url, config);
    },
    patch: <T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> => {
        return client.patch(url, data, config);
    }
};

export default typedClient;
