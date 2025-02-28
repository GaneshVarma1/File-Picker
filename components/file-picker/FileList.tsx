"use client";

import { FileItem, Folder } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  File, 
  Folder as FolderIcon, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  FileType,
  MoreHorizontal,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileListProps {
  files: FileItem[];
  folders: Folder[];
  isLoading: boolean;
  onFolderClick: (folder: Folder) => void;
  onToggleIndex: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  isSearching: boolean;
  selectedFiles: string[];
  onToggleSelect: (fileId: string) => void;
}

export function FileList({ 
  files, 
  folders, 
  isLoading, 
  onFolderClick, 
  onToggleIndex, 
  onRemoveFile,
  isSearching,
  selectedFiles,
  onToggleSelect
}: FileListProps) {
  
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    if (mimeType.includes('presentation')) return <Presentation className="h-5 w-5 text-orange-600" />;
    if (mimeType.includes('wordprocessing')) return <FileText className="h-5 w-5 text-blue-600" />;
    if (mimeType.includes('pdf')) return <FileType className="h-5 w-5 text-red-600" />;
    if (mimeType.includes('image')) return <Image className="h-5 w-5 text-purple-600" />;
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <LoadingState />
      </div>
    );
  }

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="mt-8 text-center py-12">
        <File className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No files found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isSearching ? 'No files match your search criteria.' : 'This folder is empty.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-[400px]">Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <TableRow key={folder.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">
                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => onFolderClick(folder)}
                >
                  <FolderIcon className="h-5 w-5 text-blue-500" />
                  <span>{folder.name}</span>
                </div>
              </TableCell>
              <TableCell>You</TableCell>
              <TableCell>{formatDate(folder.modifiedTime)}</TableCell>
              <TableCell>—</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onFolderClick(folder)}>
                      <div className="flex items-center">
                        <FolderIcon className="h-4 w-4 mr-2 text-blue-500" />
                        Open folder
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Drive
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        View details
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {files.map((file) => (
            <TableRow key={file.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox 
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => onToggleSelect(file.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.mimeType)}
                  <span>{file.name}</span>
                  {file.isIndexed && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      Indexed
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>You</TableCell>
              <TableCell>{formatDate(file.modifiedTime)}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleIndex(file.id)}>
                        {file.isIndexed ? (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Remove from index
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Add to index
                          </div>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in Drive
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={file.isIndexed ? "text-red-600" : "text-blue-600"}
                    onClick={() => onToggleIndex(file.id)}
                  >
                    {file.isIndexed ? 'Remove' : 'Import'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}