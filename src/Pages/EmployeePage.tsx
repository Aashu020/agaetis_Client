import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

  const rangeStart = totalEmployees === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalEmployees);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10 lg:px-[6%]">
        {/* Page heading */}
        <section className="mb-6 flex items-start justify-between gap-4 sm:mb-8 sm:items-center">
          <div className="min-w-0">
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
            aria-label="Refresh employees"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
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
        <section className="mb-6 grid grid-cols-2 gap-3 sm:mb-7 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-12 sm:w-12">
              <Users size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                Total Employees
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                {totalEmployees}
              </h2>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
              <UserPlus size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500 sm:text-sm">
                Matching Employees
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
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

          {/*
            Fixed-height card: header + search stay on top, only the list
            scrolls, and the pagination bar is pinned to the bottom.
          */}
          <section className="flex h-[85vh] min-h-[520px] min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:h-[80vh]">
            {/* Card header */}
            <div className="flex shrink-0 items-start justify-between gap-3 px-4 py-4 sm:items-center sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-900">
                  Team Members
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your employee records.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                {totalEmployees}
              </span>
            </div>

            {/* Search */}
            <div className="shrink-0">
              <EmployeeSearch
                value={search}
                onChange={(value) => {
                  setCurrentPage(1);
                  setSearch(value);
                }}
              />
            </div>

            {/* Scrollable list */}
            <div
              className="min-h-0 flex-1 overflow-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              <EmployeeTable
                employees={employees}
                onEdit={setEditingEmployee}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>

            {/* Pagination, always pinned to the bottom */}
            {totalEmployees > 0 && (
              <div className="flex shrink-0 flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                <p className="order-2 text-center text-sm text-gray-500 sm:order-1 sm:text-left">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {rangeStart}
                  </span>
                  {"–"}
                  <span className="font-semibold text-gray-800">
                    {rangeEnd}
                  </span>
                  {" of "}
                  <span className="font-semibold text-gray-800">
                    {totalEmployees}
                  </span>{" "}
                  employees
                </p>

                <div className="order-1 flex items-center justify-between gap-2 sm:order-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage <= 1 || loading}
                    aria-label="Previous page"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <span className="whitespace-nowrap rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
                    {currentPage} / {Math.max(1, totalPages)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage >= totalPages || loading}
                    aria-label="Next page"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
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
