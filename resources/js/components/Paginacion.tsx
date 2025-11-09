import { router } from '@inertiajs/react';

interface LinkItem {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginacionProps {
  links: LinkItem[];
}

export default function Paginacion({ links }: PaginacionProps) {
  return (
    <div className="flex justify-center mt-4 space-x-2">
      {links.map((link, index) => (
        <button
          key={index}
          disabled={!link.url}
          onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
          className={`px-3 py-1 text-sm rounded-lg ${
            link.active
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}
