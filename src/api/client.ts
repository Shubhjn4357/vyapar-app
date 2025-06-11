import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiError, AuthError } from './errors';

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
        if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            throw new AuthError('Authentication failed');
        }
        throw new ApiError(
            error.response?.data?.message || 'An error occurred',
            error,
            error.response?.status
        );
    }
);
