"use client";

import { create } from 'zustand';
import { FileItem, Folder, SortConfig, FilterConfig } from './types';

interface FileStore {
  // Files and folders
  files: FileItem[];
  folders: Folder[];
  selectedFiles: string[];
  
  // Navigation
  currentFolder: string;
  folderPath: { id: string; name: string }[];
  
  // UI state
  isLoading: boolean;
  isSearching: boolean;
  searchQuery: string;
  searchResults: FileItem[];
  
  // Sorting and filtering
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  
  // Actions
  setFiles: (files: FileItem[]) => void;
  setFolders: (folders: Folder[]) => void;
  setCurrentFolder: (folderId: string) => void;
  setFolderPath: (path: { id: string; name: string }[]) => void;
  addToFolderPath: (folder: { id: string; name: string }) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (results: FileItem[]) => void;
  setSortConfig: (config: SortConfig) => void;
  setFilterConfig: (config: FilterConfig) => void;
  toggleSelectedFile: (fileId: string) => void;
  selectAllFiles: () => void;
  clearSelectedFiles: () => void;
  updateFileIndexStatus: (fileId: string, isIndexed: boolean) => void;
  updateMultipleFileIndexStatus: (fileIds: string[], isIndexed: boolean) => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  files: [],
  folders: [],
  selectedFiles: [],
  currentFolder: 'root',
  folderPath: [{ id: 'root', name: 'Google Drive' }],
  isLoading: false,
  isSearching: false,
  searchQuery: '',
  searchResults: [],
  sortConfig: { key: 'name', direction: 'asc' } as SortConfig,
  filterConfig: {} as FilterConfig,
};

export const useFileStore = create<FileStore>((set) => ({
  // Initial state
  ...initialState,
  
  // Actions
  setFiles: (files) => set({ files }),
  setFolders: (folders) => set({ folders }),
  setCurrentFolder: (folderId) => set({ currentFolder: folderId }),
  setFolderPath: (path) => set({ folderPath: path }),
  addToFolderPath: (folder) => set((state) => ({ 
    folderPath: [...state.folderPath, folder] 
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setFilterConfig: (config) => set({ filterConfig: config }),
  
  toggleSelectedFile: (fileId) => set((state) => {
    const isSelected = state.selectedFiles.includes(fileId);
    return {
      selectedFiles: isSelected
        ? state.selectedFiles.filter(id => id !== fileId)
        : [...state.selectedFiles, fileId]
    };
  }),
  
  selectAllFiles: () => set((state) => ({
    selectedFiles: state.isSearching 
      ? state.searchResults.map(file => file.id)
      : state.files.map(file => file.id)
  })),
  
  clearSelectedFiles: () => set({ selectedFiles: [] }),
  
  updateFileIndexStatus: (fileId, isIndexed) => set((state) => ({
    files: state.files.map(file => 
      file.id === fileId ? { ...file, isIndexed } : file
    ),
    searchResults: state.searchResults.map(file => 
      file.id === fileId ? { ...file, isIndexed } : file
    )
  })),
  
  updateMultipleFileIndexStatus: (fileIds, isIndexed) => set((state) => ({
    files: state.files.map(file => 
      fileIds.includes(file.id) ? { ...file, isIndexed } : file
    ),
    searchResults: state.searchResults.map(file => 
      fileIds.includes(file.id) ? { ...file, isIndexed } : file
    ),
    selectedFiles: isIndexed ? [] : state.selectedFiles // Clear selection after indexing
  })),
  
  resetState: () => set(initialState)
}));