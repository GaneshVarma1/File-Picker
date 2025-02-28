"use client";

import { useFilePicker } from "@/hooks/useFilePicker";
import { FileList } from "./FileList";
import { FileToolbar } from "./FileToolbar";
import { Breadcrumb } from "./Breadcrumb";
import { Card } from "@/components/ui/card";
import { GoogleDriveIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LogIn, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { CreateKBDialog } from "@/components/knowledge-base/create-kb-dialog";

export default function FilePicker() {
  const {
    login,
    logout,
    isAuthenticated,
    user,
    isLoading: authLoading,
  } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const {
    files,
    folders,
    selectedFiles,
    folderPath,
    isLoading,
    isSearching,
    searchQuery,
    sortConfig,
    filterConfig,
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
    isAllSelected,
    selectedCount,
    indexedCount,
    isConnected,
    refreshFiles,
  } = useFilePicker();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await login();
      refreshFiles();
    } catch (error) {
      console.error("Error signing in to Google:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Initializing Google Drive...</p>
        </div>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="overflow-hidden border-0 shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <GoogleDriveIcon className="h-16 w-16 mb-6" />
          <h2 className="text-xl font-medium mb-2">Connect to Google Drive</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            You need to sign in with your Google account to access your Drive
            files.
          </p>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="flex items-center"
          >
            {isSigningIn && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            {isSigningIn ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="overflow-hidden border-0 shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <GoogleDriveIcon className="h-16 w-16 mb-6" />
          <h2 className="text-xl font-medium mb-2">Connect to Google Drive</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            You need to connect your Google Drive account to access your files.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => logout()}>
              Sign Out
            </Button>
            <Button
              onClick={refreshFiles}
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isLoading ? "Connecting..." : "Refresh Connection"}
            </Button>
          </div>
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
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Connected
            </span>
            {user && (
              <span className="text-xs text-gray-500 ml-2">{user.email}</span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => refreshFiles()}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
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
                // Clear selection after successful KB creation
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
