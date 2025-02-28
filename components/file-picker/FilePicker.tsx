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
      <Card className="overflow-hidden border-0 shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <GoogleDriveIcon className="h-6 w-6" />
            <h2 className="text-lg font-medium">Google Drive</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={refreshFiles}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="mb-4">
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

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
              We recommend selecting as few items as needed.
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmDialog(true)}
              disabled={selectedCount === 0}
            >
              Cancel
            </Button>
            <CreateKBDialog
              selectedFiles={selectedFiles}
              onSuccess={() => {
                handleBulkRemove();
              }}
            />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel selection?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel? Your current selection will be
              lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowConfirmDialog(false)}
            >
              No, keep selection
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                setShowConfirmDialog(false);
                handleBulkRemove();
              }}
            >
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
