import { client } from './client';
import { ApiResponse } from '../types/api';
import { Payment } from '../types/payment';

export interface PaymentFilters {
    page?: number;
    limit?: number;
    billId?: string;
    companyId?: string;
    method?: string;
    status?: 'pending' | 'completed' | 'failed';
    startDate?: string;
    endDate?: string;
    search?: string;
    sortBy?: 'date' | 'amount' | 'method';
    sortOrder?: 'asc' | 'desc';
}

export interface PaymentSummary {
    totalPayments: number;
    totalCount: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
}

export interface PaymentMethodSummary {
    method: string;
    totalAmount: number;
    count: number;
}

export interface CreatePaymentData {
    billId: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
    companyId: string;
}

export interface UpdatePaymentData {
    amount?: number;
    method?: string;
    status?: 'pending' | 'completed' | 'failed';
    reference?: string;
    notes?: string;
}

export interface PaymentsListResponse {
    payments: Payment[];
    total: number;
    page: number;
    totalPages: number;
}

export const paymentsApi = {
    // Get all payments with filters and pagination
    getPayments: async (filters: PaymentFilters = {}): Promise<ApiResponse<PaymentsListResponse>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/payments?${params.toString()}`);
        return response as unknown as ApiResponse<PaymentsListResponse>;
    },

    // Create a new payment
    createPayment: async (paymentData: CreatePaymentData): Promise<ApiResponse<Payment>> => {
        const response = await client.post('/payments', paymentData);
        return response as unknown as ApiResponse<Payment>;
    },

    // Get payment by ID
    getPaymentById: async (id: string): Promise<ApiResponse<Payment>> => {
        const response = await client.get(`/payments/${id}`);
        return response as unknown as ApiResponse<Payment>;
    },

    // Update payment
    updatePayment: async (id: string, updateData: UpdatePaymentData): Promise<ApiResponse<Payment>> => {
        const response = await client.put(`/payments/${id}`, updateData);
        return response as unknown as ApiResponse<Payment>;
    },

    // Delete payment
    deletePayment: async (id: string): Promise<ApiResponse<{ message: string }>> => {
        const response = await client.delete(`/payments/${id}`);
        return response as unknown as ApiResponse<{ message: string }>;
    },

    // Get payment summary
    getPaymentSummary: async (filters: {
        startDate?: string;
        endDate?: string;
        companyId?: string;
    } = {}): Promise<ApiResponse<PaymentSummary>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/payments/summary?${params.toString()}`);
        return response as unknown as ApiResponse<PaymentSummary>;
    },

    // Get payment methods summary
    getPaymentMethods: async (filters: {
        startDate?: string;
        endDate?: string;
        companyId?: string;
    } = {}): Promise<ApiResponse<PaymentMethodSummary[]>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/payments/methods?${params.toString()}`);
        return response as unknown as ApiResponse<PaymentMethodSummary[]>;
    },

    // Get recent payments
    getRecentPayments: async (filters: {
        limit?: number;
        companyId?: string;
    } = {}): Promise<ApiResponse<Payment[]>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        
        const response = await client.get(`/payments/recent?${params.toString()}`);
        return response as unknown as ApiResponse<Payment[]>;
    },
};