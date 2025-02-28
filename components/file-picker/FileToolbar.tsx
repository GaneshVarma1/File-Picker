"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  SortAsc, 
  SortDesc, 
  Search, 
  Calendar, 
  FileText,
  X,
  Filter,
  ArrowDownUp,
  Image,
  FileSpreadsheet,
  Presentation,
  FileType
} from 'lucide-react';
import { SortConfig } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

interface FileToolbarProps {
  onSearch: (query: string) => void;
  onSort: (key: 'name' | 'date') => void;
  sortConfig: SortConfig;
  searchQuery: string;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
  selectedCount: number;
  onFilter?: (filters: {
    mimeTypes?: string[];
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export function FileToolbar({ 
  onSearch, 
  onSort, 
  sortConfig, 
  searchQuery, 
  onSelectAll,
  isAllSelected,
  selectedCount,
  onFilter
}: FileToolbarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [activeFilters, setActiveFilters] = useState<{
    mimeTypes: string[];
    dateRange: string;
  }>({
    mimeTypes: [],
    dateRange: ''
  });

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    onSearch('');
  };

  const handleFilterChange = (type: 'mimeTypes' | 'dateRange', value: string) => {
    let newFilters = { ...activeFilters };
    
    if (type === 'mimeTypes') {
      if (newFilters.mimeTypes.includes(value)) {
        newFilters.mimeTypes = newFilters.mimeTypes.filter(t => t !== value);
      } else {
        newFilters.mimeTypes = [...newFilters.mimeTypes, value];
      }
    } else if (type === 'dateRange') {
      newFilters.dateRange = value === newFilters.dateRange ? '' : value;
    }
    
    setActiveFilters(newFilters);
    
    if (onFilter) {
      const dateFilters: { dateFrom?: string; dateTo?: string } = {};
      
      if (newFilters.dateRange === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        dateFilters.dateFrom = sevenDaysAgo.toISOString();
      } else if (newFilters.dateRange === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilters.dateFrom = thirtyDaysAgo.toISOString();
      }
      
      onFilter({
        mimeTypes: newFilters.mimeTypes.length > 0 ? newFilters.mimeTypes : undefined,
        ...dateFilters
      });
    }
  };

  const getFilterCount = () => {
    let count = 0;
    if (activeFilters.mimeTypes.length > 0) count += activeFilters.mimeTypes.length;
    if (activeFilters.dateRange) count += 1;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 py-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="select-all" 
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-medium">Select all</label>
        {selectedCount > 0 && (
          <div className="text-sm text-gray-500 ml-2">{selectedCount}</div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center text-gray-600"
            >
              <ArrowDownUp className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSort('name')} className="flex justify-between">
              Name
              {sortConfig.key === 'name' && (
                sortConfig.direction === 'asc' ? 
                <SortAsc className="h-4 w-4" /> : 
                <SortDesc className="h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort('date')} className="flex justify-between">
              Date modified
              {sortConfig.key === 'date' && (
                sortConfig.direction === 'asc' ? 
                <SortAsc className="h-4 w-4" /> : 
                <SortDesc className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center text-gray-600"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
              {filterCount > 0 && (
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {filterCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2 py-1">
                File Type
              </DropdownMenuLabel>
              
              <DropdownMenuCheckboxItem 
                checked={activeFilters.mimeTypes.includes('document')}
                onCheckedChange={() => handleFilterChange('mimeTypes', 'document')}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Documents
                </div>
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem 
                checked={activeFilters.mimeTypes.includes('spreadsheet')}
                onCheckedChange={() => handleFilterChange('mimeTypes', 'spreadsheet')}
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                  Spreadsheets
                </div>
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem 
                checked={activeFilters.mimeTypes.includes('presentation')}
                onCheckedChange={() => handleFilterChange('mimeTypes', 'presentation')}
              >
                <div className="flex items-center">
                  <Presentation className="h-4 w-4 mr-2 text-orange-600" />
                  Presentations
                </div>
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem 
                checked={activeFilters.mimeTypes.includes('pdf')}
                onCheckedChange={() => handleFilterChange('mimeTypes', 'pdf')}
              >
                <div className="flex items-center">
                  <FileType className="h-4 w-4 mr-2 text-red-600" />
                  PDFs
                </div>
              </DropdownMenuCheckboxItem>
              
              <DropdownMenuCheckboxItem 
                checked={activeFilters.mimeTypes.includes('image')}
                onCheckedChange={() => handleFilterChange('mimeTypes', 'image')}
              >
                <div className="flex items-center">
                  <Image className="h-4 w-4 mr-2 text-purple-600" />
                  Images
                </div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2 py-1">
                Date Modified
              </DropdownMenuLabel>
              
              <DropdownMenuRadioGroup value={activeFilters.dateRange}>
                <DropdownMenuRadioItem 
                  value="7days"
                  onClick={() => handleFilterChange('dateRange', '7days')}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 7 days
                  </div>
                </DropdownMenuRadioItem>
                
                <DropdownMenuRadioItem 
                  value="30days"
                  onClick={() => handleFilterChange('dateRange', '30days')}
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 30 days
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            
            {filterCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setActiveFilters({ mimeTypes: [], dateRange: '' });
                    if (onFilter) onFilter({});
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  Clear all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full sm:w-[250px] h-9 text-sm"
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
          {localSearchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}