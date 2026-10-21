
import { Search, X } from "lucide-react";

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EmployeeSearch({
  value,
  onChange,
}: EmployeeSearchProps) {
  return (
    <div className="mx-4 mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 sm:mx-6">
      <Search size={19} className="shrink-0 text-gray-400" />

      <input
        type="search"
        placeholder="Search by employee name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search employees by name"
        className="w-full min-w-0 border-0 bg-transparent py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}
