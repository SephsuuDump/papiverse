export interface InventoryLog {
    id: number;
    inventoryId: number;
    rawMaterialCode: string;
    rawMaterialName: string;
    branchId: string;
    branchName?: string;
    quantityChanged: number;
    type: string;
    source: string;
    orderId: number | null;
    dateTime: string;
}