import { client } from './client';
import { Bill, BillSummary, CreateBillRequest, UpdateBillRequest } from '../types/bill';
import { ApiResponse } from '../types/api';

export const billsApi = {
    // Get all bills with optional filters
    getBills: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        customerId?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
    }): Promise<ApiResponse<{ bills: Bill[]; total: number; page: number; totalPages: number }>> => {
        const response = await client.get('/bills', { params });
        return response.data;
    },

    // Get bill by ID
    getBillById: async (id: string): Promise<ApiResponse<Bill>> => {
        const response = await client.get(`/bills/${id}`);
        return response.data;
    },

    // Create new bill
    createBill: async (billData: CreateBillRequest): Promise<ApiResponse<Bill>> => {
        const response = await client.post('/bills', billData);
        return response.data;
    },

    // Update bill
    updateBill: async (id: string, billData: UpdateBillRequest): Promise<ApiResponse<Bill>> => {
        const response = await client.put(`/bills/${id}`, billData);
        return response.data;
    },

    // Delete bill
    deleteBill: async (id: string): Promise<ApiResponse<void>> => {
        const response = await client.delete(`/bills/${id}`);
        return response.data;
    },

    // Get bill summary/statistics
    getBillSummary: async (params?: {
        startDate?: string;
        endDate?: string;
        customerId?: string;
    }): Promise<ApiResponse<BillSummary>> => {
        const response = await client.get('/bills/summary', { params });
        return response.data;
    },

    // Mark bill as paid
    markAsPaid: async (id: string, paymentData: {
        paymentMethod: string;
        paymentDate: string;
        amount: number;
        notes?: string;
    }): Promise<ApiResponse<Bill>> => {
        const response = await client.post(`/bills/${id}/payment`, paymentData);
        return response.data;
    },

    // Send bill to customer
    sendBill: async (id: string, sendData: {
        email?: string;
        phone?: string;
        method: 'email' | 'sms' | 'whatsapp';
        message?: string;
    }): Promise<ApiResponse<void>> => {
        const response = await client.post(`/bills/${id}/send`, sendData);
        return response.data;
    },

    // Generate bill PDF
    generatePDF: async (id: string): Promise<ApiResponse<{ pdfUrl: string }>> => {
        const response = await client.get(`/bills/${id}/pdf`);
        return response.data;
    },

    // Duplicate bill
    duplicateBill: async (id: string): Promise<ApiResponse<Bill>> => {
        const response = await client.post(`/bills/${id}/duplicate`);
        return response.data;
    },

    // Get recent bills
    getRecentBills: async (limit: number = 10): Promise<ApiResponse<Bill[]>> => {
        const response = await client.get(`/bills/recent?limit=${limit}`);
        return response.data;
    },

    // Get overdue bills
    getOverdueBills: async (): Promise<ApiResponse<Bill[]>> => {
        const response = await client.get('/bills/overdue');
        return response.data;
    },

    // Bulk update bills
    bulkUpdateBills: async (billIds: string[], updateData: Partial<UpdateBillRequest>): Promise<ApiResponse<void>> => {
        const response = await client.put('/bills/bulk-update', { billIds, updateData });
        return response.data;
    },

    // Get bill analytics
    getBillAnalytics: async (params?: {
        startDate?: string;
        endDate?: string;
        groupBy?: 'day' | 'week' | 'month' | 'year';
    }): Promise<ApiResponse<{
        totalBills: number;
        totalAmount: number;
        averageAmount: number;
        chartData: Array<{ period: string; amount: number; count: number }>;
    }>> => {
        const response = await client.get('/bills/analytics', { params });
        return response.data;
    }
};