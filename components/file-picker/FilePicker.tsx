"use client";

import { useFilePicker } from "@/hooks/useFilePicker";
import { FileList } from "./FileList";
import { FileToolbar } from "./FileToolbar";
import { Breadcrumb } from "./Breadcrumb";
import { Card } from "@/components/ui/card";
import { GoogleDriveIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateKBDialog } from "@/components/knowledge-base/create-kb-dialog";

export function FilePicker() {
  const {
    files,
    folders,
    selectedFiles,
    folderPath,
    isLoading,
    isSearching,
    searchQuery,
    sortConfig,
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
    isAllSelected,
    selectedCount,
    indexedCount,
  } = useFilePicker();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading your files...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <GoogleDriveIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold dark:text-white">
              Google Drive
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshFiles}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Refresh
          </Button>
        </div>

        <div className="mb-6">
          <Breadcrumb
            path={folderPath}
            onBreadcrumbClick={handleBreadcrumbClick}
          />
        </div>

        <FileToolbar
          onSearch={handleSearch}
          onSort={handleSort}
          sortConfig={sortConfig}
          searchQuery={searchQuery}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          selectedCount={selectedCount}
          onFilter={handleFilter}
        />

        <FileList
          files={files}
          folders={folders}
          isLoading={isLoading}
          onFolderClick={handleFolderClick}
          onToggleIndex={handleToggleIndex}
          onRemoveFile={handleRemoveFile}
          isSearching={isSearching}
          selectedFiles={selectedFiles}
          onToggleSelect={toggleSelectedFile}
        />

        <div className="flex justify-between items-center mt-6 pt-6 border-t dark:border-gray-700">
          <div className="flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            <span className="text-gray-600 dark:text-gray-300">
              Select items carefully for optimal performance
            </span>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmDialog(true)}
              disabled={selectedCount === 0}
              className="hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Cancel
            </Button>
            <CreateKBDialog
              selectedFiles={selectedFiles}
              onSuccess={handleBulkRemove}
            />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancel selection?</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Are you sure you want to cancel? Your current selection will be
              lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Keep selection
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setShowConfirmDialog(false);
                handleBulkRemove();
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
