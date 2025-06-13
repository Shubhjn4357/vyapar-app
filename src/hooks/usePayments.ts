import { useState, useEffect } from 'react';
import { paymentsApi, PaymentFilters, PaymentSummary, PaymentMethodSummary, CreatePaymentData, UpdatePaymentData } from '../api/payments';
import { Payment } from '../types/payment';
import { ApiResponse } from '../types/api';

export const usePayments = (filters: PaymentFilters = {}) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPayments = async (newFilters: PaymentFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.getPayments({ ...filters, ...newFilters });
            if (response.status === 'success' && response.data) {
                setPayments(response.data.payments);
                setTotal(response.data.total);
                setPage(response.data.page);
                setTotalPages(response.data.totalPages);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const createPayment = async (paymentData: CreatePaymentData): Promise<Payment | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.createPayment(paymentData);
            if (response.status === 'success' && response.data) {
                await fetchPayments(); // Refresh the list
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to create payment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updatePayment = async (id: string, updateData: UpdatePaymentData): Promise<Payment | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.updatePayment(id, updateData);
            if (response.status === 'success' && response.data) {
                await fetchPayments(); // Refresh the list
                return response.data;
            }
            return null;
        } catch (err: any) {
            setError(err.message || 'Failed to update payment');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deletePayment = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.deletePayment(id);
            if (response.status === 'success') {
                await fetchPayments(); // Refresh the list
                return true;
            }
            return false;
        } catch (err: any) {
            setError(err.message || 'Failed to delete payment');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchPayments();
    };

    return {
        payments,
        loading,
        error,
        total,
        page,
        totalPages,
        fetchPayments,
        createPayment,
        updatePayment,
        deletePayment,
        refresh,
    };
};

export const usePaymentSummary = (filters: { startDate?: string; endDate?: string; companyId?: string } = {}) => {
    const [summary, setSummary] = useState<PaymentSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.getPaymentSummary(filters);
            if (response.status === 'success' && response.data) {
                setSummary(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch payment summary');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [filters.startDate, filters.endDate, filters.companyId]);

    return {
        summary,
        loading,
        error,
        refresh: fetchSummary,
    };
};

export const usePaymentMethods = (filters: { startDate?: string; endDate?: string; companyId?: string } = {}) => {
    const [methods, setMethods] = useState<PaymentMethodSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMethods = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.getPaymentMethods(filters);
            if (response.status === 'success' && response.data) {
                setMethods(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch payment methods');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMethods();
    }, [filters.startDate, filters.endDate, filters.companyId]);

    return {
        methods,
        loading,
        error,
        refresh: fetchMethods,
    };
};

export const useRecentPayments = (filters: { limit?: number; companyId?: string } = {}) => {
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentPayments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentsApi.getRecentPayments(filters);
            if (response.status === 'success' && response.data) {
                setRecentPayments(response.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch recent payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentPayments();
    }, [filters.limit, filters.companyId]);

    return {
        recentPayments,
        loading,
        error,
        refresh: fetchRecentPayments,
    };
};