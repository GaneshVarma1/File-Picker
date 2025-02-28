"use client";

import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  path: { id: string; name: string }[];
  onBreadcrumbClick: (folderId: string, index: number) => void;
}

export function Breadcrumb({ path, onBreadcrumbClick }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        {path.map((folder, index) => (
          <li key={folder.id} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            <button
              onClick={() => onBreadcrumbClick(folder.id, index)}
              className={`inline-flex items-center text-sm font-medium ${
                index === path.length - 1
                  ? 'text-gray-700 cursor-default'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
              disabled={index === path.length - 1}
            >
              {index === 0 ? (
                <>
                  <Home className="h-4 w-4 mr-1" />
                  {folder.name}
                </>
              ) : (
                folder.name
              )}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}