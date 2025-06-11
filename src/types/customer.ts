export interface Customer {
    id: string;
    companyId: string;
    name: string;
    email?: string;
    phone?: string;
    address?: any;
    gstin?: string;
    balance?: string;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}
