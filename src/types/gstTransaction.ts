export interface GSTTransaction {
    id: string;
    companyId: string;
    billId?: string;
    type: 'sale' | 'purchase';
    date: string;
    partyName?: string;
    partyGstin?: string;
    taxableAmount: number;
    totalTax: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
    total: number;
    items?: any;
    placeOfSupply?: string;
    reverseCharge?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface GSTTransactionItem {
    id?: string;
    name: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    taxableAmount: number;
    cgstRate: number;
    sgstRate: number;
    igstRate: number;
    cessRate?: number;
    cgstAmount: number;
    sgstAmount: number;
    igstAmount: number;
    cessAmount?: number;
    totalAmount: number;
}

export interface GSTSummary {
    period: string;
    totalSales: number;
    totalPurchases: number;
    totalTaxCollected: number;
    totalTaxPaid: number;
    netTaxLiability: number;
    cgstLiability: number;
    sgstLiability: number;
    igstLiability: number;
    cessLiability: number;
    itcAvailable: number;
    itcUtilized: number;
}

export interface GSTR1Data {
    period: string;
    b2bTransactions: GSTTransaction[];
    b2cTransactions: GSTTransaction[];
    exportTransactions: GSTTransaction[];
    creditNotes: GSTTransaction[];
    debitNotes: GSTTransaction[];
    totalTaxableValue: number;
    totalTaxAmount: number;
    summary: {
        b2bValue: number;
        b2cValue: number;
        exportValue: number;
        totalValue: number;
    };
}

export interface GSTR2Data {
    period: string;
    b2bPurchases: GSTTransaction[];
    importTransactions: GSTTransaction[];
    creditNotes: GSTTransaction[];
    debitNotes: GSTTransaction[];
    totalTaxableValue: number;
    totalTaxAmount: number;
    itcClaimed: number;
    summary: {
        b2bValue: number;
        importValue: number;
        totalValue: number;
        itcAvailable: number;
    };
}

export interface GSTR3BData {
    period: string;
    outwardSupplies: {
        taxableValue: number;
        integratedTax: number;
        centralTax: number;
        stateTax: number;
        cess: number;
    };
    inwardSupplies: {
        taxableValue: number;
        integratedTax: number;
        centralTax: number;
        stateTax: number;
        cess: number;
    };
    itcDetails: {
        itcAvailable: number;
        itcReversed: number;
        netItc: number;
    };
    taxPayable: {
        integratedTax: number;
        centralTax: number;
        stateTax: number;
        cess: number;
        total: number;
    };
}

