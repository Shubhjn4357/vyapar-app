import { client } from './client';
import {
    DashboardMetrics,
    SalesReport,
    PurchaseReport,
    TaxReport,
    ProfitLossReport,
    CashFlowReport,
    ReportFilters
} from '../types/reports';
import { ApiResponse } from '../types/api';

export const reportsApi = {
    // Get dashboard metrics
    getDashboardMetrics: async (params?: {
        startDate?: string;
        endDate?: string;
        companyId?: string;
    }): Promise<ApiResponse<DashboardMetrics>> => {
        const response = await client.get('/reports/dashboard', { params });
        return response as unknown as any;
    },

    // Get sales report
    getSalesReport: async (params?: ReportFilters & {
        groupBy?: 'day' | 'week' | 'month' | 'year';
        companyId?: string;
    }): Promise<ApiResponse<SalesReport>> => {
        const response = await client.get('/reports/sales', { params });
        return response as unknown as any;
    },

    // Get purchase report
    getPurchaseReport: async (params?: ReportFilters & {
        groupBy?: 'day' | 'week' | 'month' | 'year';
        companyId?: string;
    }): Promise<ApiResponse<PurchaseReport>> => {
        const response = await client.get('/reports/purchases', { params });
        return response as unknown as any;
    },

    // Get tax report
    getTaxReport: async (params?: ReportFilters): Promise<ApiResponse<TaxReport>> => {
        const response = await client.get('/reports/tax', { params });
        return response as unknown as any;
    },

    // Get profit & loss report
    getProfitLossReport: async (params?: ReportFilters): Promise<ApiResponse<ProfitLossReport>> => {
        const response = await client.get('/reports/profit-loss', { params });
        return response as unknown as any;
    },

    // Get cash flow report
    getCashFlowReport: async (params?: ReportFilters): Promise<ApiResponse<CashFlowReport>> => {
        const response = await client.get('/reports/cash-flow', { params });
        return response as unknown as any;
    },

    // Get customer-wise sales report
    getCustomerSalesReport: async (params?: ReportFilters): Promise<ApiResponse<{
        customers: Array<{
            customerId: string;
            customerName: string;
            totalAmount: number;
            billsCount: number;
            lastPurchaseDate: string;
            averageOrderValue: number;
        }>;
        totalAmount: number;
        totalCustomers: number;
    }>> => {
        const response = await client.get('/reports/customer-sales', { params });
        return response as unknown as any;
    },

    // Get product-wise sales report
    getProductSalesReport: async (params?: ReportFilters): Promise<ApiResponse<{
        products: Array<{
            productName: string;
            quantitySold: number;
            totalAmount: number;
            averageRate: number;
            profitMargin: number;
        }>;
        totalAmount: number;
        totalProducts: number;
    }>> => {
        const response = await client.get('/reports/product-sales', { params });
        return response as unknown as any;
    },

    // Get aging report (outstanding amounts)
    getAgingReport: async (params?: {
        asOfDate?: string;
        customerId?: string;
    }): Promise<ApiResponse<{
        customers: Array<{
            customerId: string;
            customerName: string;
            totalOutstanding: number;
            current: number;
            days30: number;
            days60: number;
            days90: number;
            days90Plus: number;
        }>;
        totalOutstanding: number;
        summary: {
            current: number;
            days30: number;
            days60: number;
            days90: number;
            days90Plus: number;
        };
    }>> => {
        const response = await client.get('/reports/aging', { params });
        return response as unknown as any;
    },

    // Get monthly comparison report
    getMonthlyComparison: async (params?: {
        year?: number;
        metric?: 'sales' | 'purchases' | 'profit';
    }): Promise<ApiResponse<{
        currentYear: Array<{
            month: string;
            value: number;
            growth: number;
        }>;
        previousYear: Array<{
            month: string;
            value: number;
        }>;
        totalGrowth: number;
    }>> => {
        const response = await client.get('/reports/monthly-comparison', { params });
        return response as unknown as any;
    },

    // Export report to PDF/Excel
    exportReport: async (reportType: string, format: 'pdf' | 'excel', params?: ReportFilters): Promise<ApiResponse<{
        downloadUrl: string;
        fileName: string;
    }>> => {
        const response = await client.post('/reports/export', {
            reportType,
            format,
            filters: params
        });
        return response as unknown as any;
    },

    // Get business insights
    getBusinessInsights: async (params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<ApiResponse<{
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
    }>> => {
        const response = await client.get('/reports/insights', { params });
        return response as unknown as any;
    }
};