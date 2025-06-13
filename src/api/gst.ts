import { client } from './client';
import {
    GSTTransaction,
    GSTSummary,
    GSTR1Data,
    GSTR2Data,
    GSTR3BData
} from '../types/gstTransaction';
import { ApiResponse } from '../types/api';

export const gstApi = {
    // Get GST transactions
    getGSTTransactions: async (params?: {
        page?: number;
        limit?: number;
        type?: 'sale' | 'purchase' | 'credit_note' | 'debit_note';
        startDate?: string;
        endDate?: string;
        partyGstin?: string;
        search?: string;
        companyId?: string;
    }): Promise<ApiResponse<{
        transactions: GSTTransaction[];
        total: number;
        page: number;
        totalPages: number;
    }>> => {
        const response = await client.get('/gst/transactions', { params });
        return response as unknown as any;
    },

    // Get GST transaction by ID
    getGSTTransactionById: async (id: string): Promise<ApiResponse<GSTTransaction>> => {
        const response = await client.get(`/gst/transactions/${id}`);
        return response as unknown as any;
    },

    // Create GST transaction
    createGSTTransaction: async (transactionData: Omit<GSTTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<GSTTransaction>> => {
        const response = await client.post('/gst/transactions', transactionData);
        return response as unknown as any;
    },

    // Update GST transaction
    updateGSTTransaction: async (id: string, transactionData: Partial<GSTTransaction>): Promise<ApiResponse<GSTTransaction>> => {
        const response = await client.put(`/gst/transactions/${id}`, transactionData);
        return response as unknown as any;
    },

    // Delete GST transaction
    deleteGSTTransaction: async (id: string): Promise<ApiResponse<void>> => {
        const response = await client.delete(`/gst/transactions/${id}`);
        return response as unknown as any;
    },

    // Get GST summary
    getGSTSummary: async (params?: {
        startDate?: string;
        endDate?: string;
        period?: string; // YYYY-MM format
    }): Promise<ApiResponse<GSTSummary>> => {
        const response = await client.get('/gst/summary', { params });
        return response as unknown as any;
    },

    // Get GSTR-1 data
    getGSTR1Data: async (period: string): Promise<ApiResponse<GSTR1Data>> => {
        const response = await client.get(`/gst/gstr1/${period}`);
        return response as unknown as any;
    },

    // Get GSTR-2 data
    getGSTR2Data: async (period: string): Promise<ApiResponse<GSTR2Data>> => {
        const response = await client.get(`/gst/gstr2/${period}`);
        return response as unknown as any;
    },

    // Get GSTR-3B data
    getGSTR3BData: async (period: string): Promise<ApiResponse<GSTR3BData>> => {
        const response = await client.get(`/gst/gstr3b/${period}`);
        return response as unknown as any;
    },

    // Generate GSTR-1 JSON file
    generateGSTR1JSON: async (period: string): Promise<ApiResponse<{
        downloadUrl: string;
        fileName: string;
    }>> => {
        const response = await client.post(`/gst/gstr1/${period}/generate`);
        return response as unknown as any;
    },

    // Generate GSTR-3B JSON file
    generateGSTR3BJSON: async (period: string): Promise<ApiResponse<{
        downloadUrl: string;
        fileName: string;
    }>> => {
        const response = await client.post(`/gst/gstr3b/${period}/generate`);
        return response as unknown as any;
    },

    // Validate GSTIN
    validateGSTIN: async (gstin: string): Promise<ApiResponse<{
        isValid: boolean;
        businessName?: string;
        address?: string;
        status?: string;
        registrationDate?: string;
    }>> => {
        const response = await client.post('/gst/validate-gstin', { gstin });
        return response as unknown as any;
    },

    // Get HSN-wise summary
    getHSNSummary: async (params?: {
        startDate?: string;
        endDate?: string;
        type?: 'sale' | 'purchase' | 'credit_note' | 'debit_note';
    }): Promise<ApiResponse<{
        hsnData: Array<{
            hsnCode: string;
            description: string;
            quantity: number;
            taxableValue: number;
            cgstAmount: number;
            sgstAmount: number;
            igstAmount: number;
            totalTax: number;
        }>;
        totalTaxableValue: number;
        totalTaxAmount: number;
    }>> => {
        const response = await client.get('/gst/hsn-summary', { params });
        return response as unknown as any;
    },

    // Get GST reconciliation data
    getGSTReconciliation: async (period: string): Promise<ApiResponse<{
        books: {
            sales: number;
            purchases: number;
            taxCollected: number;
            taxPaid: number;
        };
        returns: {
            gstr1Sales: number;
            gstr2Purchases: number;
            gstr3bTaxCollected: number;
            gstr3bTaxPaid: number;
        };
        differences: {
            salesDifference: number;
            purchasesDifference: number;
            taxCollectedDifference: number;
            taxPaidDifference: number;
        };
        mismatches: Array<{
            type: string;
            description: string;
            amount: number;
            suggestions: string[];
        }>;
    }>> => {
        const response = await client.get(`/gst/reconciliation/${period}`);
        return response as unknown as any;
    },

    // Get e-Invoice status
    getEInvoiceStatus: async (transactionId: string): Promise<ApiResponse<{
        status: 'pending' | 'generated' | 'cancelled';
        irn?: string;
        ackNo?: string;
        ackDate?: string;
        qrCode?: string;
        signedInvoice?: string;
        errors?: string[];
    }>> => {
        const response = await client.get(`/gst/e-invoice/${transactionId}/status`);
        return response as unknown as any;
    },

    // Generate e-Invoice
    generateEInvoice: async (transactionId: string): Promise<ApiResponse<{
        irn: string;
        ackNo: string;
        ackDate: string;
        qrCode: string;
        signedInvoice: string;
    }>> => {
        const response = await client.post(`/gst/e-invoice/${transactionId}/generate`);
        return response as unknown as any;
    },

    // Cancel e-Invoice
    cancelEInvoice: async (transactionId: string, reason: string): Promise<ApiResponse<{
        cancelDate: string;
        status: string;
    }>> => {
        const response = await client.post(`/gst/e-invoice/${transactionId}/cancel`, { reason });
        return response as unknown as any;
    },

    // Get GST rates
    getGSTRates: async (hsnCode?: string): Promise<ApiResponse<{
        rates: Array<{
            hsnCode: string;
            description: string;
            cgstRate: number;
            sgstRate: number;
            igstRate: number;
            cessRate?: number;
            effectiveFrom: string;
        }>;
    }>> => {
        const response = await client.get('/gst/rates', { params: { hsnCode } });
        return response as unknown as any;
    },

    // Bulk import GST transactions
    bulkImportTransactions: async (file: FormData): Promise<ApiResponse<{
        imported: number;
        failed: number;
        errors: Array<{
            row: number;
            error: string;
        }>;
    }>> => {
        const response = await client.post('/gst/bulk-import', file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response as unknown as any;
    }
};