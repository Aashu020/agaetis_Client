import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import type { Employee, EmployeeInput } from "../../types/employee";

interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: (data: EmployeeInput) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: EmployeeInput = {
  name: "",
  email: "",
  role: "",
};

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeInput>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(
      employee
        ? {
            name: employee.name,
            email: employee.email,
            role: employee.role,
          }
        : { ...emptyForm }
    );
    setError("");
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const input = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role.trim(),
    };

    if (!input.name || !input.email || !input.role) {
      setError("Please fill in all fields.");
      return;
    }

    if (input.name.length > 100 || input.role.length > 100) {
      setError("Name and role must be 100 characters or fewer.");
      return;
    }

    if (input.email.length > 255) {
      setError("Email must be 255 characters or fewer.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await onSubmit(input);
      setForm({ ...emptyForm });
    } catch {
      // The parent displays the API error.
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-indigo-600">
          {employee ? "UPDATE RECORD" : "NEW RECORD"}
        </span>

        <h3 className="mt-2 text-xl font-bold tracking-tight text-gray-900">
          {employee ? "Edit Employee" : "Add Employee"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {employee
            ? "Update the employee information below."
            : "Enter details to add a new team member."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>

          <input
            id="name"
            name="name"
            placeholder="e.g. Priya Sharma"
            value={form.name}
            onChange={handleChange}
            maxLength={100}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="priya@company.com"
            value={form.email}
            onChange={handleChange}
            maxLength={255}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className={labelClass}>
            Job role
          </label>

          <input
            id="role"
            name="role"
            placeholder="e.g. Software Engineer"
            value={form.role}
            onChange={handleChange}
            maxLength={100}
            className={inputClass}
            required
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {loading
              ? "Saving..."
              : employee
                ? "Save Changes"
                : "Add Employee"}
          </button>

          {employee && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}