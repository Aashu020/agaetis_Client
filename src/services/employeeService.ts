
import axios from "axios";
import type {
  Employee,
  EmployeeInput,
  EmployeeListResponse,
} from "../types/employee";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const employeeService = {
  getAll: async (
    page = 1,
    limit = 5,
    search = ""
  ): Promise<EmployeeListResponse> => {
    const response = await api.get<EmployeeListResponse>("/employees", {
      params: { page, limit, search },
    });

    return response.data;
  },

  create: async (input: EmployeeInput): Promise<Employee> => {
    const response = await api.post<Employee>("/employees", input);
    return response.data;
  },

  update: async (
    id: number,
    input: EmployeeInput
  ): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${id}`, input);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};

export default api;