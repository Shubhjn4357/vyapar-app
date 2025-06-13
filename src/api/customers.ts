import { client } from './client';
import { ApiResponse } from '../types/api';
import { CreateCustomerRequest, Customer } from '../types/customer';



export const customersApi = {
    // Get all customers
    getCustomers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
        sortBy?: 'name' | 'totalAmount' | 'lastTransactionDate';
        sortOrder?: 'asc' | 'desc';
    }): Promise<ApiResponse<{
        customers: Customer[];
        total: number;
        page: number;
        totalPages: number;
    }>> => {
        const response = await client.get('/customers', { params });
        return response.data;
    },

    // Get customer by ID
    getCustomerById: async (id: string): Promise<ApiResponse<Customer>> => {
        const response = await client.get(`/customers/${id}`);
        return response.data;
    },

    // Create new customer
    createCustomer: async (customerData: CreateCustomerRequest): Promise<ApiResponse<Customer>> => {
        const response = await client.post('/customers', customerData);
        return response.data;
    },

    // Update customer
    updateCustomer: async (id: string, customerData: Partial<CreateCustomerRequest>): Promise<ApiResponse<Customer>> => {
        const response = await client.put(`/customers/${id}`, customerData);
        return response.data;
    },

    // Delete customer
    deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
        const response = await client.delete(`/customers/${id}`);
        return response.data;
    },

    // Get customer transactions
    getCustomerTransactions: async (id: string, params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<{
        transactions: Array<{
            id: string;
            type: 'bill' | 'payment' | 'credit_note' | 'debit_note';
            date: string;
            amount: number;
            status: string;
            description: string;
        }>;
        total: number;
        page: number;
        totalPages: number;
    }>> => {
        const response = await client.get(`/customers/${id}/transactions`, { params });
        return response.data;
    },

    // Get customer statement
    getCustomerStatement: async (id: string, params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<{
        customer: Customer;
        openingBalance: number;
        transactions: Array<{
            date: string;
            description: string;
            debit: number;
            credit: number;
            balance: number;
        }>;
        closingBalance: number;
        totalDebit: number;
        totalCredit: number;
    }>> => {
        const response = await client.get(`/customers/${id}/statement`, { params });
        return response.data;
    },

    // Search customers
    searchCustomers: async (query: string): Promise<ApiResponse<Customer[]>> => {
        const response = await client.get(`/customers/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Get top customers
    getTopCustomers: async (params?: {
        limit?: number;
        sortBy?: 'totalAmount' | 'totalBills' | 'lastTransactionDate';
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<Customer[]>> => {
        const response = await client.get('/customers/top', { params });
        return response.data;
    },

    // Bulk import customers
    bulkImportCustomers: async (file: FormData): Promise<ApiResponse<{
        imported: number;
        failed: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>> => {
        const response = await client.post('/customers/bulk-import', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Export customers
    exportCustomers: async (format: 'csv' | 'excel'): Promise<ApiResponse<{
        downloadUrl: string;
        fileName: string;
    }>> => {
        const response = await client.post('/customers/export', { format });
        return response.data;
    }
};