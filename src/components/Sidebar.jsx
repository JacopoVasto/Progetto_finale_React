import GenresDropdown from "./GenresDropdown"

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-base-200 p-4 border-r border-base-300">
            <h2 className="text-lg font-bold mb-4">Filtra per genere</h2>
            <GenresDropdown />
        </aside>
    );
}