import type { SelectPayments } from "e:/myApp/vyapar-server/src/db/schema";

export interface Payment {
    id: string;
    billId: string;
    companyId: string;
    amount: string;
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
