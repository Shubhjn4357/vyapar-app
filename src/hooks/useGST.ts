import { useState, useEffect, useCallback } from 'react';
import { gstApi } from '../api/gst';
import {
    GSTTransaction,
    GSTSummary,
    GSTR1Data,
    GSTR2Data,
    GSTR3BData
} from '../types/gstTransaction';

export const useGSTTransactions = () => {
    const [transactions, setTransactions] = useState<GSTTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchTransactions = useCallback(async (params?: {
        page?: number;
        limit?: number;
        type?: 'sale' | 'purchase' | 'credit_note' | 'debit_note';
        startDate?: string;
        endDate?: string;
        partyGstin?: string;
        search?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getGSTTransactions(params);
            setTransactions(response.data.transactions);
            setPagination({
                page: response.data.page,
                totalPages: response.data.totalPages,
                total: response.data.total
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch GST transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTransaction = useCallback(async (transactionData: Omit<GSTTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<GSTTransaction | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.createGSTTransaction(transactionData);
            const newTransaction = response.data;
            setTransactions(prev => [newTransaction, ...prev]);
            return newTransaction;
        } catch (err: any) {
            setError(err.message || 'Failed to create GST transaction');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTransaction = useCallback(async (id: string, transactionData: Partial<GSTTransaction>): Promise<GSTTransaction | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.updateGSTTransaction(id, transactionData);
            const updatedTransaction = response.data;
            setTransactions(prev => prev.map(transaction => transaction.id === id ? updatedTransaction : transaction));
            return updatedTransaction;
        } catch (err: any) {
            setError(err.message || 'Failed to update GST transaction');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await gstApi.deleteGSTTransaction(id);
            setTransactions(prev => prev.filter(transaction => transaction.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete GST transaction');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        pagination,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        refetch: fetchTransactions
    };
};

export const useGSTSummary = () => {
    const [summary, setSummary] = useState<GSTSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async (params?: {
        startDate?: string;
        endDate?: string;
        period?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getGSTSummary(params);
            setSummary(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch GST summary');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return {
        summary,
        loading,
        error,
        fetchSummary,
        refetch: fetchSummary
    };
};

export const useGSTR1 = () => {
    const [data, setData] = useState<GSTR1Data | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGSTR1 = useCallback(async (period: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getGSTR1Data(period);
            setData(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch GSTR-1 data');
        } finally {
            setLoading(false);
        }
    }, []);

    const generateJSON = useCallback(async (period: string): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.generateGSTR1JSON(period);
            return response.data.downloadUrl;
        } catch (err: any) {
            setError(err.message || 'Failed to generate GSTR-1 JSON');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        fetchGSTR1,
        generateJSON
    };
};

export const useGSTR2 = () => {
    const [data, setData] = useState<GSTR2Data | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGSTR2 = useCallback(async (period: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getGSTR2Data(period);
            setData(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch GSTR-2 data');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        fetchGSTR2
    };
};

export const useGSTR3B = () => {
    const [data, setData] = useState<GSTR3BData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGSTR3B = useCallback(async (period: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getGSTR3BData(period);
            setData(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch GSTR-3B data');
        } finally {
            setLoading(false);
        }
    }, []);

    const generateJSON = useCallback(async (period: string): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.generateGSTR3BJSON(period);
            return response.data.downloadUrl;
        } catch (err: any) {
            setError(err.message || 'Failed to generate GSTR-3B JSON');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,
        loading,
        error,
        fetchGSTR3B,
        generateJSON
    };
};

export const useGSTValidation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateGSTIN = useCallback(async (gstin: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.validateGSTIN(gstin);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Failed to validate GSTIN');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        validateGSTIN
    };
};

export const useEInvoice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getStatus = useCallback(async (transactionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.getEInvoiceStatus(transactionId);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Failed to get e-Invoice status');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const generate = useCallback(async (transactionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.generateEInvoice(transactionId);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Failed to generate e-Invoice');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancel = useCallback(async (transactionId: string, reason: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await gstApi.cancelEInvoice(transactionId, reason);
            return response.data;
        } catch (err: any) {
            setError(err.message || 'Failed to cancel e-Invoice');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getStatus,
        generate,
        cancel
    };
};