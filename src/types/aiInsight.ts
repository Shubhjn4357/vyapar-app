export interface AIInsight {
    id: string;
    companyId: string;
    type: 'tax_optimization' | 'risk' | 'trend' | 'forecast' | 'expense_analysis';
    data: any;
    createdAt?: string;
    updatedAt?: string;
}
