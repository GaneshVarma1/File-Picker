"use client";

import { FileItem, Folder } from './types';

// Mock data for demonstration when Google API fails
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Proposal.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    modifiedTime: '2025-04-10T14:30:00Z',
    size: '245 KB',
    isIndexed: true,
    parentId: 'root'
  },
  {
    id: '2',
    name: 'Budget 2025.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    modifiedTime: '2025-04-08T09:15:00Z',
    size: '128 KB',
    isIndexed: false,
    parentId: 'root'
  },
  {
    id: '3',
    name: 'Meeting Notes.pdf',
    mimeType: 'application/pdf',
    modifiedTime: '2025-04-12T16:45:00Z',
    size: '1.2 MB',
    isIndexed: true,
    parentId: 'root'
  },
  {
    id: '4',
    name: 'Product Roadmap.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    modifiedTime: '2025-04-05T11:20:00Z',
    size: '3.5 MB',
    isIndexed: false,
    parentId: 'root'
  },
  {
    id: '5',
    name: 'Research Paper.pdf',
    mimeType: 'application/pdf',
    modifiedTime: '2025-04-01T08:30:00Z',
    size: '2.8 MB',
    isIndexed: true,
    parentId: 'docs'
  },
  {
    id: '6',
    name: 'Client Feedback.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    modifiedTime: '2025-04-03T13:45:00Z',
    size: '198 KB',
    isIndexed: false,
    parentId: 'docs'
  }
];

const mockFolders: Folder[] = [
  {
    id: 'docs',
    name: 'Documents',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2025-04-02T09:30:00Z',
    isFolder: true,
    parentId: 'root'
  },
  {
    id: 'images',
    name: 'Images',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2025-03-29T14:20:00Z',
    isFolder: true,
    parentId: 'root'
  }
];

// Check if user is signed in to Google
export const isSignedInToGoogle = (): boolean => {
  return localStorage.getItem('google_user') !== null;
};

// Format file size
const formatFileSize = (bytes?: string): string => {
  if (!bytes) return 'Unknown';
  
  const size = parseInt(bytes, 10);
  if (isNaN(size)) return 'Unknown';
  
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  if (size < 1024 * 1024 * 1024) return `${Math.round(size / (1024 * 1024))} MB`;
  return `${Math.round(size / (1024 * 1024 * 1024))} GB`;
};

// Fetch files from Google Drive
export const fetchDriveFiles = async (folderId: string = 'root'): Promise<{ files: FileItem[], folders: Folder[] }> => {
  try {
    // Check if user is signed in
    if (!isSignedInToGoogle()) {
      throw new Error('User not signed in to Google');
    }

    // For demo purposes, return mock data
    // In a real app, you would use the Google Drive API to fetch files
    const files = mockFiles.filter(file => file.parentId === folderId);
    const folders = mockFolders.filter(folder => folder.parentId === folderId);
    
    return { files, folders };
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    return { files: [], folders: [] };
  }
};

// Search files in Google Drive
export const searchDriveFiles = async (query: string): Promise<FileItem[]> => {
  try {
    // Check if user is signed in
    if (!isSignedInToGoogle()) {
      throw new Error('User not signed in to Google');
    }

    // For demo purposes, filter mock data based on the query
    // In a real app, you would use the Google Drive API to search files
    const files = mockFiles.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return files;
  } catch (error) {
    console.error('Error searching Google Drive files:', error);
    return [];
  }
};

// Filter files by type and date
export const filterDriveFiles = async (
  folderId: string = 'root',
  filters: {
    name?: string;
    mimeTypes?: string[];
    dateFrom?: string;
    dateTo?: string;
  }
): Promise<FileItem[]> => {
  try {
    // Check if user is signed in
    if (!isSignedInToGoogle()) {
      throw new Error('User not signed in to Google');
    }

    // For demo purposes, filter mock data based on the filters
    // In a real app, you would use the Google Drive API to filter files
    let filteredFiles = mockFiles.filter(file => file.parentId === folderId);
    
    if (filters.name) {
      const lowerCaseName = filters.name.toLowerCase();
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(lowerCaseName)
      );
    }
    
    if (filters.mimeTypes && filters.mimeTypes.length > 0) {
      filteredFiles = filteredFiles.filter(file => 
        filters.mimeTypes!.some(type => file.mimeType.includes(type))
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).getTime();
      filteredFiles = filteredFiles.filter(file => 
        new Date(file.modifiedTime).getTime() >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).getTime();
      filteredFiles = filteredFiles.filter(file => 
        new Date(file.modifiedTime).getTime() <= toDate
      );
    }
    
    return filteredFiles;
  } catch (error) {
    console.error('Error filtering Google Drive files:', error);
    return [];
  }
};

// Check if a file is indexed in your system
export const checkFileIndexStatus = async (fileId: string): Promise<boolean> => {
  // This would need to be implemented based on your indexing system
  // For now, we'll return a mock response
  return mockFiles.find(file => file.id === fileId)?.isIndexed || false;
};

// Add a file to the index
export const addFileToIndex = async (fileId: string): Promise<boolean> => {
  // This would need to be implemented based on your indexing system
  // For now, we'll return a mock response
  return true;
};

// Remove a file from the index
export const removeFileFromIndex = async (fileId: string): Promise<boolean> => {
  // This would need to be implemented based on your indexing system
  // For now, we'll return a mock response
  return true;
};