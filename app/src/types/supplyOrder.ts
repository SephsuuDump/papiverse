export interface SupplyOrder {
    orderId?: number;
    branchName: string;
    orderDate: string;
    status: string;
    remarks: string;
    completeOrderTotalAmount: number;

    meatCategory?: {
        meatOrderId: number;
        isApproved: boolean;
        categoryTotal: number;
        meatItems: {
            rawMaterialCode: string;
            rawMaterialName: string;
            unitMeasurement: string;
            quantity: number;
            price: number;
        } []
    }

    snowfrostCategory?: {
        snowFrostOrderId: number;
        isApproved: boolean;
        categoryTotal: number;
        snowFrostItems: {
            rawMaterialCode: string;
            rawMaterialName: string;
            unitMeasurement: string;
            quantity: number;
            price: number;
        } []
    }
}

export interface SupplyItem {
    category?: string;        
    code?: string;          
    name?: string;           
    quantity?: number;        
    unitMeasurement?: string; 
    unitPrice?: number;
    unitQuantity?: number;
}

export interface CompleteOrder {
    branchId: number;
    remarks: string;
    meatCategoryItemId: string;
    snowfrostCategoryItemId: string;
}

interface OrderItem {
    code?: string;
    quantity?: number;
}   

export interface CategoryOrder {
    id: string;
    branchId: number;
    categoryitems: OrderItem[];
}