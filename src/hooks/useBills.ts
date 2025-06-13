import { useState, useEffect, useCallback } from 'react';
import { billsApi } from '../api/bills';
import { Bill, BillSummary, CreateBillRequest, UpdateBillRequest } from '../types/bill';

export const useBills = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchBills = useCallback(async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        customerId?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.getBills(params);
            if (response.status === "success" && response.data) {
                setBills(response.data.bills);
                setPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    total: response.data.total
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bills');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBill = useCallback(async (billData: CreateBillRequest): Promise<Bill | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.createBill(billData);
            if (response.status === "success" && response.data) {
                setBills(prev => [response.data, ...prev]);
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to create bill');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBill = useCallback(async (id: string, billData: UpdateBillRequest): Promise<Bill | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.updateBill(id, billData);
            if (response.status === "success" && response.data) {
                setBills(prev => prev.map(bill => bill.id === id ? response.data : bill));
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to update bill');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBill = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await billsApi.deleteBill(id);
            setBills(prev => prev.filter(bill => bill.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to delete bill');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const markAsPaid = useCallback(async (id: string, paymentData: {
        paymentMethod: string;
        paymentDate: string;
        amount: number;
        notes?: string;
    }): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.markAsPaid(id, paymentData);
            if (response.status === "success" && response.data) {
                setBills(prev => prev.map(bill => bill.id === id ? response.data : bill));
            }
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to mark bill as paid');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendBill = useCallback(async (id: string, sendData: {
        email?: string;
        phone?: string;
        method: 'email' | 'sms' | 'whatsapp';
        message?: string;
    }): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await billsApi.sendBill(id, sendData);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to send bill');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const generatePDF = useCallback(async (id: string): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.generatePDF(id);
            return response.status === "success" && response.data ? response.data.pdfUrl : null;
        } catch (err: any) {
            setError(err.message || 'Failed to generate PDF');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    return {
        bills,
        loading,
        error,
        pagination,
        fetchBills,
        createBill,
        updateBill,
        deleteBill,
        markAsPaid,
        sendBill,
        generatePDF,
        refetch: fetchBills
    };
};

export const useBillSummary = () => {
    const [summary, setSummary] = useState<BillSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async (params?: {
        startDate?: string;
        endDate?: string;
        customerId?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.getBillSummary(params);
            setSummary(response.status === "success" ? response.data : null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bill summary');
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

export const useBillById = (id: string) => {
    const [bill, setBill] = useState<Bill | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBill = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.getBillById(id);
            setBill(response.status === "success" ? response.data : null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bill');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBill();
    }, [fetchBill]);

    return {
        bill,
        loading,
        error,
        refetch: fetchBill
    };
};