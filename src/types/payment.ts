export interface Payment {
    id: string;
    billId: string;
    companyId: string;
    amount: number;
    date: string;
    method: string; // Changed from 'mode' to 'method' to match server schema
    status: 'pending' | 'completed' | 'failed';
    reference?: string;
    notes?: string;
    metadata?: any;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}
