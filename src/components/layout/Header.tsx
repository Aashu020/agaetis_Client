
import { Users } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-[6%]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Users size={23} />
        </div>

        <div>
          <h2 className="font-['Manrope'] text-lg font-extrabold tracking-tight text-gray-900">
            Agaetis tech
          </h2>
         
        </div>
      </div>

      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 sm:px-4">
        <span className="hidden sm:inline">Admin Dashboard</span>
        <span className="sm:hidden">Admin</span>
      </span>
    </header>
  );
}
