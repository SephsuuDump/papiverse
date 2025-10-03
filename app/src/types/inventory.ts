export interface Inventory {
    id?: number;
    orderId?: number;
    code?: string;
    name?: string;
    unitPrice?: number;
    unitMeasurement?: string;
    category?: string;
    quantity?: number;
    branchId?: number;

    changedQuantity?: number;
    rawMaterialCode?: string;
    type?: string;
    source?: string;
}

export const inventoryInit: Inventory = {
    rawMaterialCode: "",
    changedQuantity: 0,
    branchId: 1,
    type: "",
    source: "",
};

export const inventoryUpdate : Inventory = {
    rawMaterialCode : "",
    branchId : 0,
    changedQuantity : 0,
    type : "IN",
    source : "INPUT"

}

export const inventoryFields: (keyof Inventory)[] = [
    "rawMaterialCode",
    "changedQuantity",
    "branchId",
];