import { useState, useEffect, useCallback } from 'react';
import { reportsApi } from '../api/reports';
import {
    DashboardMetrics,
    SalesReport,
    PurchaseReport,
    TaxReport,
    ProfitLossReport,
    CashFlowReport,
    ReportFilters
} from '../types/reports';

export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async (params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getDashboardMetrics(params);
            setMetrics(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard metrics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return {
        metrics,
        loading,
        error,
        fetchMetrics,
        refetch: fetchMetrics
    };
};

export const useSalesReport = () => {
    const [report, setReport] = useState<SalesReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (params?: ReportFilters & {
        groupBy?: 'day' | 'week' | 'month' | 'year';
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getSalesReport(params);
            setReport(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch sales report');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        report,
        loading,
        error,
        fetchReport,
        refetch: fetchReport
    };
};

export const usePurchaseReport = () => {
    const [report, setReport] = useState<PurchaseReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (params?: ReportFilters & {
        groupBy?: 'day' | 'week' | 'month' | 'year';
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getPurchaseReport(params);
            setReport(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch purchase report');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        report,
        loading,
        error,
        fetchReport,
        refetch: fetchReport
    };
};

export const useTaxReport = () => {
    const [report, setReport] = useState<TaxReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (params?: ReportFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getTaxReport(params);
            setReport(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tax report');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        report,
        loading,
        error,
        fetchReport,
        refetch: fetchReport
    };
};

export const useProfitLossReport = () => {
    const [report, setReport] = useState<ProfitLossReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (params?: ReportFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getProfitLossReport(params);
            setReport(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profit & loss report');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        report,
        loading,
        error,
        fetchReport,
        refetch: fetchReport
    };
};

export const useCashFlowReport = () => {
    const [report, setReport] = useState<CashFlowReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (params?: ReportFilters) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getCashFlowReport(params);
            setReport(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch cash flow report');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        report,
        loading,
        error,
        fetchReport,
        refetch: fetchReport
    };
};

export const useBusinessInsights = () => {
    const [insights, setInsights] = useState<{
        insights: Array<{
            type: 'growth' | 'trend' | 'alert' | 'opportunity';
            title: string;
            description: string;
            value?: number;
            change?: number;
            severity?: 'low' | 'medium' | 'high';
        }>;
        recommendations: Array<{
            title: string;
            description: string;
            priority: 'low' | 'medium' | 'high';
            category: string;
        }>;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInsights = useCallback(async (params?: {
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.getBusinessInsights(params);
            setInsights(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch business insights');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInsights();
    }, [fetchInsights]);

    return {
        insights,
        loading,
        error,
        fetchInsights,
        refetch: fetchInsights
    };
};

export const useReportExport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const exportReport = useCallback(async (
        reportType: string,
        format: 'pdf' | 'excel',
        params?: ReportFilters
    ): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportsApi.exportReport(reportType, format, params);
            return response.data.downloadUrl;
        } catch (err: any) {
            setError(err.message || 'Failed to export report');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        exportReport
    };
};