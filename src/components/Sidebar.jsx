import GenresDropdown from "./GenresDropdown";
import { Filter } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="relative">
      {/* 🔹 MOBILE: Drawer */}
      <div className="drawer md:hidden">
        <input id="mobile-filter-drawer" type="checkbox" className="drawer-toggle peer" />
        <div className="drawer-content" />
        <div className="drawer-side z-40">
          <label htmlFor="mobile-filter-drawer" className="drawer-overlay"></label>
          <aside className="menu p-4 w-64 bg-base-200 min-h-full border-r border-base-300">
            <h2 className="text-lg font-bold mb-4">Filtra per genere</h2>
            <GenresDropdown />
          </aside>
        </div>

        <label
          htmlFor="mobile-filter-drawer"
          className="btn btn-primary btn-circle fixed bottom-4 left-4 z-50 shadow-lg md:hidden peer-checked:hidden"
          title="Filtra per genere"
        >
          <Filter className="w-5 h-5" />
        </label>
      </div>

      {/* 🔹 DESKTOP: Sidebar fissa */}
      <div className="hidden md:flex md-static top-0 left-0 h-full w-64 bg-base-200 p-4 border-r border-base-300 z-30">
        <aside className="w-full">
          <h2 className="text-lg font-bold mb-4">Filtra per genere</h2>
          <GenresDropdown />
        </aside>
      </div>
    </div>
  );
}
