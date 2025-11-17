import { BASE_URL, IMPORTATION_URL } from "@/lib/urls";
import { requestData } from "./_config";

const salesUrl = `${BASE_URL}/sales`;
const importationUrl = `${IMPORTATION_URL}/api`;


export class SalesService {
    static async getOverallSummary(start: string, end: string) {
        return await requestData(
            `${salesUrl}/get-overall?start=${start}&end=${end}`,
            'GET'
        )
    }

    static async getSalesByBranch(branchId: number, start: string, end: string) {
        return await requestData(
            `${salesUrl}/get-summary?branchId=${branchId}&start=${start}&end=${end}`,
            'GET'
        )
    }

    static async getPaidOrders(branchId: number, start: string, end: string) {
        return await requestData(
            `${salesUrl}/get-detailed?branchId=${branchId}&start=${start}&end=${end}`,
            'GET'
        )
    }

    static async readPaidOrders(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        
        return await requestData(
            `${importationUrl}/read-paid-orders`,
            'POST',
            undefined,
            formData
        )
    }

    static async uploadPaidOrders(branchId: number, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return await requestData(
            `${salesUrl}/upload`,
            'POST',
            undefined,
            formData
        )
    }
}