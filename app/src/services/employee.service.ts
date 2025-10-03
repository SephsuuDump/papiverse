import { BASE_URL } from "@/lib/urls";
import { requestData } from "./_config";
import { Employee } from "@/types/employee";

const url = `${BASE_URL}/employees`;

export class EmployeeService {
    static async getEmployeesByBranch(id: number) {
        return await requestData(
            `${url}/get-by-branch?branchId=${id}`,
            "GET"
        );
    }

    static async getEmployeeById(id: number) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
            "GET"
        );
    }

    static async createEmployee(employee: Employee, id: number) {
        const payload = {
            ...employee,
            branchId: id,
        };

        return await requestData(
            `${url}/create`,
            "POST",
            undefined,
            payload
        );
    }

    static async updateEmployee(employee: Employee) {
        return await requestData(
            `${url}/update`,
            "POST",
            undefined,
            employee
        );
    }

    static async deleteEmployee(id: number) {
        return await requestData(
            `${url}/delete-by-id?id=${id}`,
            "POST"
        );
    }
}
