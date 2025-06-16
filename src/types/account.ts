export interface Account {
    id: string;
    companyId: string;
    name: string;
    date: string;
    description?: string;
    debit?: number;
    credit?: number;
    account: string;
    type: string;
    reference?: string;
    createdBy?: number;
    createdAt?: string;
}
