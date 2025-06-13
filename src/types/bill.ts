export interface BillItem {
    id?: string;
    name: string;
    description?: string;
    quantity: number;
    rate: number;
    unit?: string;
    taxRate: number;
    taxAmount: number;
    amount: number;
    hsnCode?: string;
    total: number;
}
export enum BillType{
    SALES = 'SALES',
    PURCHASE='PURCHASE'
}
export interface Bill {
    id: string;
    billNumber: string;
    customerId: string;
    customerName: string;
    customerGstin?: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    date: string;
    dueDate: string;
    items: BillItem[];
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    paymentStatus: 'pending' | 'partial' | 'paid';
    paymentMethod?: string;
    notes?: string;
    terms?: string;
    companyId: string;
    cgst?: number;
    sgst?: number;
    igst?: number;
    discount?: number;
    discountType?: 'percentage' | 'amount';
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BillSummary {
    totalBills: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    thisMonthBills: number;
    thisMonthAmount: number;
}

export interface CreateBillRequest {
    customerId: string;
    customerName: string;
    customerGstin?: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    date: string;
    dueDate: string;
    items: Omit<BillItem, 'id'>[];
    notes?: string;
    terms?: string;
    discount?: number;
    discountType?: 'percentage' | 'amount';
}

export interface UpdateBillRequest extends Partial<CreateBillRequest> {
    status?: Bill['status'];
    paymentStatus?: Bill['paymentStatus'];
    paymentMethod?: string;
}
