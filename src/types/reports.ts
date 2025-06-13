export interface DashboardMetrics {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalBills: number;
    paidBills: number;
    pendingBills: number;
    overdueBills: number;
    totalCustomers: number;
    activeCustomers: number;
    gstLiability: number;
    cashFlow: number;
    monthlyGrowth: number;
}

export interface SalesReport {
    period: string;
    totalSales: number;
    totalTax: number;
    netSales: number;
    billsCount: number;
    averageBillValue: number;
    topCustomers: CustomerSalesData[];
    topProducts: ProductSalesData[];
    salesByMonth: MonthlySalesData[];
    salesByCategory: CategorySalesData[];
}

export interface CustomerSalesData {
    customerId: string;
    customerName: string;
    totalAmount: number;
    billsCount: number;
    lastPurchaseDate: string;
}

export interface ProductSalesData {
    productName: string;
    quantitySold: number;
    totalAmount: number;
    averageRate: number;
}

export interface MonthlySalesData {
    month: string;
    year: number;
    totalSales: number;
    billsCount: number;
    growth: number;
}

export interface CategorySalesData {
    category: string;
    totalAmount: number;
    percentage: number;
}

export interface PurchaseReport {
    period: string;
    totalPurchases: number;
    totalTax: number;
    netPurchases: number;
    billsCount: number;
    averageBillValue: number;
    topSuppliers: SupplierPurchaseData[];
    purchasesByMonth: MonthlyPurchaseData[];
}

export interface SupplierPurchaseData {
    supplierId: string;
    supplierName: string;
    totalAmount: number;
    billsCount: number;
    lastPurchaseDate: string;
}

export interface MonthlyPurchaseData {
    month: string;
    year: number;
    totalPurchases: number;
    billsCount: number;
    growth: number;
}

export interface TaxReport {
    period: string;
    totalTaxCollected: number;
    totalTaxPaid: number;
    netTaxLiability: number;
    cgstCollected: number;
    sgstCollected: number;
    igstCollected: number;
    cgstPaid: number;
    sgstPaid: number;
    igstPaid: number;
    taxByMonth: MonthlyTaxData[];
}

export interface MonthlyTaxData {
    month: string;
    year: number;
    taxCollected: number;
    taxPaid: number;
    netTax: number;
}

export interface ProfitLossReport {
    period: string;
    revenue: number;
    costOfGoodsSold: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingProfit: number;
    otherIncome: number;
    otherExpenses: number;
    netProfit: number;
    grossProfitMargin: number;
    netProfitMargin: number;
    monthlyData: MonthlyProfitLossData[];
}

export interface MonthlyProfitLossData {
    month: string;
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
    margin: number;
}

export interface CashFlowReport {
    period: string;
    openingBalance: number;
    totalInflow: number;
    totalOutflow: number;
    closingBalance: number;
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    monthlyData: MonthlyCashFlowData[];
}

export interface MonthlyCashFlowData {
    month: string;
    year: number;
    inflow: number;
    outflow: number;
    netFlow: number;
    balance: number;
}

export interface ReportFilters {
    startDate?: string;
    endDate?: string;
    customerId?: string;
    productId?: string;
    category?: string;
    status?: string;
    paymentStatus?: string;
}