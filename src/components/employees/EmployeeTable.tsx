
import { Edit2, Mail, Trash2, Users } from "lucide-react";
import type { Employee } from "../../types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  loading: boolean;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  loading,
}: EmployeeTableProps) {
  if (loading) {
    return (
      <div className="flex min-h-56 items-center justify-center gap-3 py-12 text-sm text-gray-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        Loading employees...
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center px-5 py-12 text-center">
        <div className="mb-3 rounded-full bg-indigo-50 p-4 text-indigo-500">
          <Users size={32} />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          No employees found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Add an employee or try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="whitespace-nowrap px-5 py-4 text-xs font-bold tracking-wide text-gray-500">
              EMPLOYEE
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-xs font-bold tracking-wide text-gray-500">
              EMAIL ADDRESS
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-xs font-bold tracking-wide text-gray-500">
              JOB ROLE
            </th>
            <th className="whitespace-nowrap px-5 py-4 text-center text-xs font-bold tracking-wide text-gray-500">
              ACTIONS
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="transition-colors hover:bg-gray-50/80"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="whitespace-nowrap text-sm font-semibold text-gray-800">
                      {employee.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      ID: {employee.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4">
                <a
                  href={`mailto:${employee.email}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-gray-500 transition hover:text-indigo-600"
                >
                  <Mail size={15} className="shrink-0" />
                  {employee.email}
                </a>
              </td>

              <td className="px-5 py-4">
                <span className="inline-block whitespace-nowrap rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                  {employee.role}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    title="Edit employee"
                    aria-label={`Edit ${employee.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    title="Delete employee"
                    aria-label={`Delete ${employee.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
