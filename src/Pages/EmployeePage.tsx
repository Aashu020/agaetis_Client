
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Users, UserPlus, RefreshCw } from "lucide-react";

import Header from "../components/layout/Header";
import Alert from "../components/employees/Alert";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeSearch from "../components/employees/EmployeeSearch";
import EmployeeTable from "../components/employees/EmployeeTable";

import { employeeService } from "../services/employeeService";
import type { Employee, EmployeeInput } from "../types/employee";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message ||
        "Unable to connect to the server. Please try again."
      );
    }

    return "Something went wrong. Please try again.";
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const result = await employeeService.getAll(
        currentPage,
        pageSize,
        search.trim()
      );

      setEmployees(result.data);
      setTotalEmployees(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      setAlert({
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search]);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  // If deletion or searching leaves the current page invalid,
  // move back to a valid page.
  useEffect(() => {
    if (currentPage > Math.max(1, totalPages)) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  const handleSave = async (data: EmployeeInput) => {
    try {
      if (editingEmployee) {
        await employeeService.update(editingEmployee.id, data);

        setEditingEmployee(null);
        setAlert({
          message: "Employee updated successfully.",
          type: "success",
        });

        await fetchEmployees();
      } else {
        await employeeService.create(data);

        setAlert({
          message: "Employee added successfully.",
          type: "success",
        });

        // Show the newest record on the first page.
        if (currentPage !== 1 || search.trim()) {
          setSearch("");
          setCurrentPage(1);
        } else {
          await fetchEmployees();
        }
      }
    } catch (error) {
      setAlert({
        message: getErrorMessage(error),
        type: "error",
      });

      throw error;
    }
  };

  const handleDelete = async (employee: Employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    try {
      await employeeService.delete(employee.id);

      if (editingEmployee?.id === employee.id) {
        setEditingEmployee(null);
      }

      setAlert({
        message: "Employee deleted successfully.",
        type: "success",
      });

      // If this was the only item on the current page,
      // navigate to the previous page when possible.
      if (employees.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await fetchEmployees();
      }
    } catch (error) {
      setAlert({
        message: getErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-[6%]">
        {/* Page heading */}
        <section className="mb-8 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-600">
              WORKSPACE / DIRECTORY
            </span>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Employee Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your team members and their information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchEmployees()}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </section>

        {/* Notifications */}
        {alert && (
          <div className="mb-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Statistics */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <h2 className="mt-1 text-2xl font-bold">
                {totalEmployees}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserPlus size={23} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Matching Employees
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {totalEmployees}
              </h2>
            </div>
          </div>
        </section>

        {/* Employee form and directory */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.8fr)]">
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleSave}
            onCancel={() => setEditingEmployee(null)}
          />

          <section className="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm h-[80vh] overflow-y-auto" style={{scrollbarWidth:"none"}}>
            <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Team Members
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your employee records.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                {totalEmployees}
              </span>
            </div>

            <EmployeeSearch
              value={search}
              onChange={(value) => {
                setCurrentPage(1);
                setSearch(value);
              }}
            />

            <EmployeeTable
              employees={employees}
              onEdit={setEditingEmployee}
              onDelete={handleDelete}
              loading={loading}
            />

            {!loading && totalEmployees > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {(currentPage - 1) * pageSize + 1}
                  </span>
                  {"–"}
                  <span className="font-semibold text-gray-800">
                    {Math.min(
                      currentPage * pageSize,
                      totalEmployees
                    )}
                  </span>
                  {" of "}
                  <span className="font-semibold text-gray-800">
                    {totalEmployees}
                  </span>{" "}
                  employees
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="whitespace-nowrap px-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
