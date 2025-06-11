export interface Account {
    id: string;
    date: string;
    description?: string;
    debit?: string;
    credit?: string;
    account: string;
    type: string;
    reference?: string;
    createdBy?: number;
    createdAt?: string;
}
