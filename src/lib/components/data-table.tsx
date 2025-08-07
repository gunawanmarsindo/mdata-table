import * as React from "react"
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  type VisibilityState,
  getFilteredRowModel,
  type ColumnOrderState,
  type Row,
  type SortingState as TanStackSortingState,
} from "@tanstack/react-table"

import { useDataTable } from "../hooks/useDataTable"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTableContent } from "./data-table-content"
import type { AdditionalFilter } from '../types'
import { exportToCsv } from '../utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  endpoint: string
  pageSize?: number
  additionalFilters?: AdditionalFilter[]
  enableExport?: boolean
  tableId: string
  renderSubComponent?: (row: Row<TData>) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  endpoint,
  pageSize = 5,
  additionalFilters = [],
  enableExport = false,
  tableId,
  renderSubComponent,
}: DataTableProps<TData, TValue>) {
  const {
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
    setShowAdditionalFilters,
    loadMoreRef,
    totalRecords,
    resetAllFilters,
    exportData,
    isExporting,
    rowSelection,
    setRowSelection,
  } = useDataTable<TData>({ endpoint, pageSize, tableId })

  // Storage helpers
  const getStoredValue = React.useCallback((key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(`${tableId}-${key}`)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${tableId}-${key}":`, error)
      return defaultValue
    }
  }, [tableId])

  const setStoredValue = React.useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(`${tableId}-${key}`, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing localStorage key "${tableId}-${key}":`, error)
    }
  }, [tableId])

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    () => getStoredValue('columnVisibility', {})
  )
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => getStoredValue('columnOrder', columns.map((column, index) => 
      column.id || (column as any).accessorKey || `column-${index}`
    ))
  )

  // Convert internal sorting to TanStack sorting format
  const tanStackSorting: TanStackSortingState = React.useMemo(() => {
    if (!sorting) return []
    return [{
      id: sorting.column,
      desc: sorting.direction === 'desc'
    }]
  }, [sorting])

  const handleSortingChange = React.useCallback((updater: any) => {
    const newSorting = typeof updater === 'function' ? updater(tanStackSorting) : updater
    if (newSorting.length === 0) {
      setSorting(null)
    } else {
      const sort = newSorting[0]
      setSorting({
        column: sort.id,
        direction: sort.desc ? 'desc' : 'asc'
      })
    }
  }, [tanStackSorting, setSorting])

  // Save to localStorage
  React.useEffect(() => {
    setStoredValue('columnVisibility', columnVisibility)
  }, [columnVisibility, setStoredValue])

  React.useEffect(() => {
    setStoredValue('columnOrder', columnOrder)
  }, [columnOrder, setStoredValue])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting: tanStackSorting,
      columnVisibility,
      rowSelection,
      columnOrder,
    },
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: true,
  })

  const handleExport = async () => {
    const dataToExport = await exportData()
    exportToCsv(dataToExport, columns, "data_ekspor")
  }

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => (row.original as any).id)
    console.log("Menghapus baris yang dipilih:", selectedIds)
    setRowSelection({})
    alert(`Menghapus ${selectedIds.length} baris: ${selectedIds.join(', ')}`)
  }

  const handleBulkExportSelected = () => {
    const selectedRowsData = table.getFilteredSelectedRowModel().rows.map(row => row.original)
    if (selectedRowsData.length > 0) {
      exportToCsv(selectedRowsData, columns, "data_ekspor_dipilih")
      setRowSelection({})
    } else {
      alert("Tidak ada baris yang dipilih untuk diekspor.")
    }
  }

  return (
    <div className="w-full">
      <DataTableToolbar
        table={table}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        additionalFilters={additionalFilters}
        currentFilters={filters}
        onFilterChange={handleFilterChange}
        showAdditionalFilters={showAdditionalFilters}
        setShowAdditionalFilters={setShowAdditionalFilters}
        totalRecords={totalRecords}
        onResetFilters={resetAllFilters}
        enableExport={enableExport}
        onExport={handleExport}
        isExporting={isExporting}
        onBulkDelete={handleBulkDelete}
        onBulkExportSelected={handleBulkExportSelected}
      />
      <DataTableContent
        table={table}
        columns={columns}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasMore={hasMore}
        loadMoreRef={loadMoreRef}
        pageSize={pageSize}
        dataLength={data.length}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        searchQuery={searchQuery}
        renderSubComponent={renderSubComponent}
      />
    </div>
  )
}
