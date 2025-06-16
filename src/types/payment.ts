export interface Payment {
    id: string;
    billId: string;
    companyId: string;
    userId: number;
    amount: number;
    date: string;
    mode: string;
    status: string;
    reference?: string;
    notes?: string;
    metadata?: any;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}
