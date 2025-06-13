export interface Customer {
    id: string;
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
    paymentTerms?: number; // days
    isActive: boolean;
    totalBills: number;
    totalAmount: number;
    outstandingAmount: number;
    lastTransactionDate?: string;
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