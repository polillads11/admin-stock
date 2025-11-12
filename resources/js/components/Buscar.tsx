// components/Buscar.tsx
import { useState } from "react";

interface BuscarProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export default function Buscar({
  initialValue = "",
  onSearch,
  placeholder = "Buscar...",
}: BuscarProps) {
  const [search, setSearch] = useState(initialValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(search);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="ml-2 px-3 py-1 text-sm text-white bg-gray-600 rounded-lg hover:bg-gray-700"
      >
        Buscar
      </button>
    </form>
  );
}
