import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { Product } from "@/types/products";
import { Supply } from "@/types/supply";
import { Modifier } from "@/types/modifier";

const url = `${BASE_URL}/products`;

export class ProductService {
    static async getAllProducts() {
        return await requestData(
            `${url}/get-all`,
            'GET'
        );
    }

    static async getProductById(id: number) {
        return await requestData(
            `${url}/get-by-code?code=${id}`,
            'GET'
        );
    }

    static async getProductGroups(id: number) {
        return await requestData(
            `${url}/get-groups?product_id=${id}`,
            'GET'
        );
    }

    static async addProduct(product: Product) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            product
        );
    }

    static async linkProductGroup(productModifier: Modifier[]) {
        return await requestData(
            `${BASE_URL}/product-link/create`,
            'POST',
            undefined,
            productModifier
        )
    }

    static async updateProduct(supply: Supply) {
        const payload = {
            ...supply,
            name: supply.name?.toUpperCase(),
            unitQuantity: Number(supply.unitQuantity),
            unitPriceInternal: Number(supply.unitPriceInternal),
            unitPriceExternal: Number(supply.unitPriceExternal)
        };

        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            payload
        );
    }

    static async deleteProduct(id: number) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST'
        );
    }
}
