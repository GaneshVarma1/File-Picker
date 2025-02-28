export interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  isIndexed: boolean;
  parentId?: string;
}

export interface Folder {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  isFolder: boolean;
  parentId?: string;
}

export type SortOption = 'name' | 'date';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortOption;
  direction: SortDirection;
}

export interface FilterConfig {
  name?: string;
  type?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  mimeTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ConnectionInfo {
  connection_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  connection_provider: string;
}

export interface KnowledgeBase {
  knowledge_base_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}