import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { Inventory } from "@/types/inventory";

const url = `${BASE_URL}/inventory`;

export class InventoryService {
  static async getInventoryByBranch(id: number, page: number, size: number) {
    return await requestData(
        `${url}/get-by-branch?id=${id}&page=${page}&size=${size}`,
        "GET"
    );
  }

  static async getInventoryAudits(id: number, page: number, size: number) {
    return await requestData(
        `${url}/get-audits?branchId=${id}&page=${page}&size=${size}`,
        "GET"
    );
  }

  static async createInventory(inventory: Inventory) {
    return await requestData(
        `${url}/create`,
        "POST",
        undefined,
        inventory
    );
  }

  static async deleteInventory(id: number) {
    return await requestData(
        `${url}/delete?id=${id}`,
        "POST"
    );
  }

  static async createInventoryInput(inventory: Inventory, branchId: number) {
    return await requestData(
        `${url}/process-transaction-input`,
        "POST",
        undefined,
        inventory
    );
  }

  static async createInventoryOrder(inventory: Inventory) {
    return await requestData(
        `${url}/process-transaction-order`,
        "POST",
        undefined,
        inventory
    );
  }
}
