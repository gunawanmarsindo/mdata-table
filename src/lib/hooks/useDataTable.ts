import React from 'react';
import type { UseDataTableOptions, UseDataTableReturn, FilterState, SortingState } from '../types';

export function useDataTable<TData>({ 
  endpoint, 
  pageSize, 
  tableId 
}: UseDataTableOptions): UseDataTableReturn<TData> {
  // Generate localStorage keys based on tableId to avoid conflicts
  const getStorageKey = (key: string) => `mdata-table-${tableId}-${key}`;
  
  // Load saved state from localStorage
  const loadFromStorage = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(getStorageKey(key));
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Save state to localStorage
  const saveToStorage = (key: string, value: any) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  };

  const [data, setData] = React.useState<TData[]>([]);
  const [searchQuery, setSearchQuery] = React.useState(loadFromStorage('searchQuery', ''));
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState | null>(loadFromStorage('sorting', null));
  const [hasMore, setHasMore] = React.useState(true);
  const [filters, setFilters] = React.useState<FilterState>(loadFromStorage('filters', {}));
  const [showAdditionalFilters, setShowAdditionalFilters] = React.useState(loadFromStorage('showAdditionalFilters', false));
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [isExporting, setIsExporting] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = React.useState(1);

  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Fetch data function
  const fetchData = React.useCallback(async (page: number = 1, reset: boolean = false) => {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingNextPage(true);
    }

    try {
      // For JSONPlaceholder API, we'll fetch all data and handle pagination client-side
      // For a real API, you would use proper pagination parameters
      const queryParams = new URLSearchParams();
      
      // Only add search and filters if they exist
      if (searchQuery) queryParams.append('q', searchQuery);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      const response = await fetch(`${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      const result = await response.json();

      // Handle both array response and object with data property
      const responseData = Array.isArray(result) ? result : (result.data || []);
      
      // For APIs that return all data at once (like JSONPlaceholder),
      // we simulate pagination by slicing the data
      let filteredData = responseData;
      
      // Apply search if searchQuery exists
      if (searchQuery) {
        filteredData = responseData.filter((item: any) => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filteredData = filteredData.filter((item: any) => 
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
          );
        }
      });
      
      // Apply sorting
      if (sorting) {
        filteredData.sort((a: any, b: any) => {
          const aVal = a[sorting.column];
          const bVal = b[sorting.column];
          if (sorting.direction === 'desc') {
            return aVal < bVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }
      
      // Simulate pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      if (reset || page === 1) {
        setData(paginatedData);
      } else {
        setData(prev => [...prev, ...paginatedData]);
      }

      setTotalRecords(filteredData.length);
      setHasMore(endIndex < filteredData.length);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [endpoint, pageSize, searchQuery, filters, sorting]);

  // Load more data
  const loadMore = React.useCallback(() => {
    if (hasMore && !isFetchingNextPage) {
      fetchData(currentPage + 1, false);
    }
  }, [hasMore, isFetchingNextPage, currentPage, fetchData]);

  // Intersection Observer for infinite scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  // Refetch when dependencies change
  React.useEffect(() => {
    fetchData(1, true);
  }, [searchQuery, filters, sorting]);

  // Save search query to localStorage when it changes
  React.useEffect(() => {
    saveToStorage('searchQuery', searchQuery);
  }, [searchQuery]);

  // Save filters to localStorage when they change
  React.useEffect(() => {
    saveToStorage('filters', filters);
  }, [filters]);

  // Save sorting to localStorage when it changes
  React.useEffect(() => {
    saveToStorage('sorting', sorting);
  }, [sorting]);

  // Save showAdditionalFilters to localStorage when it changes
  React.useEffect(() => {
    saveToStorage('showAdditionalFilters', showAdditionalFilters);
  }, [showAdditionalFilters]);

  const handleFilterChange = React.useCallback((key: string, value: string | number | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSetShowAdditionalFilters = React.useCallback((show: boolean) => {
    setShowAdditionalFilters(show);
  }, []);

  const resetAllFilters = React.useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setSorting(null);
    setRowSelection({});
    // Clear localStorage when resetting
    saveToStorage('searchQuery', '');
    saveToStorage('filters', {});
    saveToStorage('sorting', null);
  }, []);

  const exportData = React.useCallback(async (): Promise<TData[]> => {
    setIsExporting(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Only add search and filters if they exist
      if (searchQuery) queryParams.append('q', searchQuery);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });

      const response = await fetch(`${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
      const result = await response.json();
      
      // Handle both array response and object with data property
      const responseData = Array.isArray(result) ? result : (result.data || []);
      
      // Apply same filtering and sorting logic as fetchData
      let filteredData = responseData;
      
      if (searchQuery) {
        filteredData = responseData.filter((item: any) => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filteredData = filteredData.filter((item: any) => 
            String(item[key]).toLowerCase().includes(String(value).toLowerCase())
          );
        }
      });
      
      if (sorting) {
        filteredData.sort((a: any, b: any) => {
          const aVal = a[sorting.column];
          const bVal = b[sorting.column];
          if (sorting.direction === 'desc') {
            return aVal < bVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error exporting data:', error);
      return [];
    } finally {
      setIsExporting(false);
    }
  }, [endpoint, searchQuery, filters, sorting]);

  return {
    data,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFetchingNextPage,
    sorting,
    setSorting,
    hasMore,
    filters,
    handleFilterChange,
    showAdditionalFilters,
    setShowAdditionalFilters: handleSetShowAdditionalFilters,
    loadMoreRef,
    totalRecords,
    resetAllFilters,
    exportData,
    isExporting,
    rowSelection,
    setRowSelection,
  };
}
