export interface Customer {
    id: string;
    companyId: string;
    userId: number;
    name: string;
    email?: string;
    phone?: string;
    address?: any;
    gstin?: string;
    contactPerson?: string;
    creditLimit?: number;
    paymentTerms?: number;
    isActive?: boolean;
    totalBills?: number;
    totalAmount?: number;
    outstandingAmount?: number;
    lastTransactionDate?: string;
    balance?: number;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCustomerRequest {
    name: string;
    email?: string;
    phone?: string;
    gstin?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    contactPerson?: string;
    creditLimit?: number;
    paymentTerms?: number;
}