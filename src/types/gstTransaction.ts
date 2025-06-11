export interface GSTTransaction {
    id: string;
    companyId: string;
    billId?: string;
    type: string;
    date: string;
    partyName?: string;
    partyGstin?: string;
    taxableAmount: string;
    totalTax: string;
    cgst?: string;
    sgst?: string;
    igst?: string;
    total: string;
    items?: any;
    placeOfSupply?: string;
    reverseCharge?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
