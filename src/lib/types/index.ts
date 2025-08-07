export interface AdditionalFilter {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterState {
  [key: string]: string | number | boolean;
}

export interface SortingState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface UseDataTableReturn<TData> {
  data: TData[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sorting: SortingState | null;
  setSorting: (sorting: SortingState | null) => void;
  hasMore: boolean;
  filters: FilterState;
  handleFilterChange: (key: string, value: string | number | boolean) => void;
  showAdditionalFilters: boolean;
  setShowAdditionalFilters: (show: boolean) => void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  totalRecords: number;
  resetAllFilters: () => void;
  exportData: () => Promise<TData[]>;
  isExporting: boolean;
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export interface UseDataTableOptions {
  endpoint: string;
  pageSize: number;
  tableId: string;
}
