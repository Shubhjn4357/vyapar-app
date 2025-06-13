export interface Product {
    id: string;
    name: string;
    description?: string;
    sku: string;
    category: string;
    price: number;
    cost?: number;
    stock: number;
    unit: string;
    hsnCode?: string;
    taxRate: number;
    isActive: boolean;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    companyId?: string;
}

export interface CreateProductData {
    name: string;
    description?: string;
    sku: string;
    category: string;
    price: number;
    cost?: number;
    stock?: number;
    unit?: string;
    hsnCode?: string;
    taxRate?: number;
    companyId: string;
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    sku?: string;
    category?: string;
    price?: number;
    cost?: number;
    stock?: number;
    unit?: string;
    hsnCode?: string;
    taxRate?: number;
    isActive?: boolean;
}

export interface StockUpdateData {
    quantity: number;
    type: 'add' | 'subtract' | 'set';
    reason?: string;
}

export interface ProductSummary {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalValue: number;
}