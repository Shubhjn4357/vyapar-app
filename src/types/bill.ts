export interface Bill {
    id: string;
    customerId: string;
    customerName: string;
    amount: string;
    date: string;
    items: any;
    status: string;
    dueDate: string;
    notes?: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}
