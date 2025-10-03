export type Supply = {
    code?: string;
    name?: string;
    unitQuantity?: number;
    unitMeasurement?: string;
    unitPriceInternal?: number;
    unitPriceExternal?: number;
    category?: string;

    unitPrice?: number; 
}

export const supplyInit: Supply = {
    code: "",
    name: "",
    unitQuantity: 0,
    unitMeasurement: "",
    unitPriceInternal: 0,
    unitPriceExternal: 0,
    category: "",
};

export const supplyFields: (keyof Supply)[] = [
    "code",
    "name",
    "unitQuantity",
    "unitMeasurement",
    "unitPriceInternal",
    "unitPriceExternal",
    "category",
];