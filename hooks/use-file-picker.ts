"use client";

import { useState, useEffect, useCallback } from 'react';
import { useFileStore } from '@/lib/store';
import { 
  fetchFiles, 
  toggleFileIndexStatus, 
  searchFiles,
  indexMultipleFiles,
  removeMultipleFilesFromIndex,
  filterFiles
} from '@/lib/api';
import { FileItem, Folder, SortConfig } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { isSignedInToGoogle } from '@/lib/google-drive-api';

export function useFilePicker() {
  const { toast } = useToast();
  
  const {
    files,
    folders,
    selectedFiles,
    currentFolder,
    folderPath,
    isLoading,
    isSearching,
    searchQuery,
    searchResults,
    sortConfig,
    filterConfig,
    setFiles,
    setFolders,
    setCurrentFolder,
    setFolderPath,
    addToFolderPath,
    setIsLoading,
    setSearchQuery,
    setIsSearching,
    setSearchResults,
    setSortConfig,
    setFilterConfig,
    toggleSelectedFile,
    selectAllFiles,
    clearSelectedFiles,
    updateFileIndexStatus,
    updateMultipleFileIndexStatus
  } = useFileStore();

  // Load files and folders for the current directory
  const loadFiles = useCallback(async () => {
    if (isSearching) return;
    
    // Check if signed in to Google
    if (!isSignedInToGoogle()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const { files: newFiles, folders: newFolders } = await fetchFiles(
        currentFolder === 'root' ? undefined : currentFolder
      );
      setFiles(newFiles);
      setFolders(newFolders);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files. Please try again.',
        variant: 'destructive',
      });
      // Clear files and folders on error
      setFiles([]);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, isSearching, setFiles, setFolders, setIsLoading, toast]);

  // Load files on component mount and when currentFolder changes
  useEffect(() => {
    if (isSignedInToGoogle()) {
      loadFiles();
    }
  }, [loadFiles]);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery) {
        setIsSearching(false);
        return;
      }

      // Check if signed in to Google
      if (!isSignedInToGoogle()) {
        return;
      }

      setIsLoading(true);
      setIsSearching(true);
      
      try {
        const results = await searchFiles(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching files:', error);
        toast({
          title: 'Search Error',
          description: 'Failed to search files. Please try again.',
          variant: 'destructive',
        });
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, setIsLoading, setIsSearching, setSearchResults, toast]);

  // Handle folder navigation
  const handleFolderClick = useCallback((folder: Folder) => {
    setCurrentFolder(folder.id);
    addToFolderPath({ id: folder.id, name: folder.name });
    setSearchQuery('');
    clearSelectedFiles();
  }, [setCurrentFolder, addToFolderPath, setSearchQuery, clearSelectedFiles]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((folderId: string, index: number) => {
    setCurrentFolder(folderId);
    setFolderPath(folderPath.slice(0, index + 1));
    setSearchQuery('');
    clearSelectedFiles();
  }, [folderPath, setCurrentFolder, setFolderPath, setSearchQuery, clearSelectedFiles]);

  // Toggle file index status
  const handleToggleIndex = useCallback(async (fileId: string) => {
    try {
      const { success } = await toggleFileIndexStatus(fileId);
      if (success) {
        updateFileIndexStatus(fileId, !files.find(f => f.id === fileId)?.isIndexed);
        
        toast({
          title: 'Success',
          description: 'File index status updated successfully.',
        });
      }
    } catch (error) {
      console.error('Error toggling index status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update index status. Please try again.',
        variant: 'destructive',
      });
    }
  }, [files, toast, updateFileIndexStatus]);

  // Remove file from index
  const handleRemoveFile = useCallback(async (fileId: string) => {
    try {
      const { success } = await removeMultipleFilesFromIndex([fileId]);
      if (success) {
        updateFileIndexStatus(fileId, false);
        
        toast({
          title: 'Success',
          description: 'File removed from index successfully.',
        });
      }
    } catch (error) {
      console.error('Error removing file from index:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove file from index. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast, updateFileIndexStatus]);

  // Handle sorting
  const handleSort = useCallback((key: 'name' | 'date') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [setSortConfig]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  // Handle filtering
  const handleFilter = useCallback(async (filters: {
    mimeTypes?: string[];
    dateFrom?: string;
    dateTo?: string;
  }) => {
    // Check if signed in to Google
    if (!isSignedInToGoogle()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const filteredFiles = await filterFiles(
        currentFolder, 
        {
          ...filters,
          name: searchQuery
        }
      );
      
      if (searchQuery || Object.keys(filters).length > 0) {
        setIsSearching(true);
        setSearchResults(filteredFiles);
      } else {
        setIsSearching(false);
      }
      
      setFilterConfig(filters);
    } catch (error) {
      console.error('Error filtering files:', error);
      toast({
        title: 'Filter Error',
        description: 'Failed to filter files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder, searchQuery, setFilterConfig, setIsLoading, setIsSearching, setSearchResults, toast]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      selectAllFiles();
    } else {
      clearSelectedFiles();
    }
  }, [selectAllFiles, clearSelectedFiles]);

  // Handle bulk indexing
  const handleBulkIndex = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setIsLoading(true);
    try {
      const { success, indexed } = await indexMultipleFiles(selectedFiles);
      if (success) {
        updateMultipleFileIndexStatus(indexed, true);
        
        toast({
          title: 'Success',
          description: `${indexed.length} files indexed successfully.`,
        });
        
        // Clear selection after successful operation
        clearSelectedFiles();
      }
    } catch (error) {
      console.error('Error indexing files:', error);
      toast({
        title: 'Error',
        description: 'Failed to index files. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFiles, setIsLoading, toast, updateMultipleFileIndexStatus, clearSelectedFiles]);

  // Handle bulk removal from index
  const handleBulkRemove = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setIsLoading(true);
    try {
      const { success, removed } = await removeMultipleFilesFromIndex(selectedFiles);
      if (success) {
        updateMultipleFileIndexStatus(removed, false);
        
        toast({
          title: 'Success',
          description: `${removed.length} files removed from index successfully.`,
        });
        
        // Clear selection after successful operation
        clearSelectedFiles();
      }
    } catch (error) {
      console.error('Error removing files from index:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove files from index. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedFiles, setIsLoading, toast, updateMultipleFileIndexStatus, clearSelectedFiles]);

  // Refresh files
  const refreshFiles = useCallback(() => {
    loadFiles();
  }, [loadFiles]);

  // Sort files and folders
  const sortedFiles = [...(isSearching ? searchResults : files)].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortConfig.direction === 'asc'
        ? new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
        : new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
    }
  });

  const sortedFolders = [...folders].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortConfig.direction === 'asc'
        ? new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
        : new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
    }
  });

  return {
    // State
    files: sortedFiles,
    folders: isSearching ? [] : sortedFolders,
    selectedFiles,
    currentFolder,
    folderPath,
    isLoading,
    isSearching,
    searchQuery,
    sortConfig,
    filterConfig,
    
    // Actions
    handleFolderClick,
    handleBreadcrumbClick,
    handleToggleIndex,
    handleRemoveFile,
    handleSort,
    handleSearch,
    handleFilter,
    handleSelectAll,
    toggleSelectedFile,
    handleBulkIndex,
    handleBulkRemove,
    refreshFiles,
    
    // Helpers
    isAllSelected: isSearching 
      ? selectedFiles.length === searchResults.length && searchResults.length > 0
      : selectedFiles.length === files.length && files.length > 0,
    selectedCount: selectedFiles.length,
    indexedCount: files.filter(f => f.isIndexed).length,
    
    // Connection status
    isConnected: isSignedInToGoogle()
  };
}