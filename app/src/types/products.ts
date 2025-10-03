export interface Product {
    id?: number;
    name: string;
    price: number;
    category: string;
    itemsNeeded: MaterialItem[];
}

interface MaterialItem {
    code?: string;
    name?: string,
    quantity?: number;
    unitMeasurement?: string;
}

export const productInit: Product = {
    name: "",
    price: 0,
    category: "",
    itemsNeeded: [],
};

export const productFields: (keyof Product)[] = [
    "name",
    "price",
    "category",
    "itemsNeeded",
];