import { useState, useEffect, useRef } from "react"
import type { Table } from "@tanstack/react-table"
import { Search, Filter, RotateCcw, Download, Trash2, Settings2, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import type { AdditionalFilter, FilterState } from "../types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchQuery: string
  setSearchQuery: (query: string) => void
  additionalFilters?: AdditionalFilter[]
  currentFilters: FilterState
  onFilterChange: (key: string, value: string | number | boolean) => void
  showAdditionalFilters: boolean
  setShowAdditionalFilters: (show: boolean) => void
  totalRecords: number
  onResetFilters: () => void
  enableExport?: boolean
  onExport?: () => void
  isExporting?: boolean
  onBulkDelete?: () => void
  onBulkExportSelected?: () => void
}

export function DataTableToolbar<TData>({
  table,
  searchQuery,
  setSearchQuery,
  additionalFilters = [],
  currentFilters,
  onFilterChange,
  showAdditionalFilters,
  setShowAdditionalFilters,
  totalRecords,
  onResetFilters,
  enableExport = false,
  onExport,
  isExporting = false,
  onBulkDelete,
  onBulkExportSelected,
}: DataTableToolbarProps<TData>) {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
  const [showColumnDropdown, setShowColumnDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false)
      }
    }

    if (showColumnDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColumnDropdown])

  return (
    <div className="space-y-4">
      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>

          {/* Additional Filters Toggle */}
          {additionalFilters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}

          {/* Reset Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bulk Actions */}
          {selectedRowCount > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedRowCount} baris dipilih
              </span>
              {onBulkDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
              )}
              {onBulkExportSelected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkExportSelected}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Ekspor Dipilih
                </Button>
              )}
            </>
          )}

          {/* Column Visibility - Simple Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Tampilan Kolom
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {showColumnDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <label
                        key={column.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={(e) => column.toggleVisibility(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm capitalize">
                          {(column.columnDef.header as string) || column.id}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          {enableExport && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Mengekspor..." : "Ekspor"}
            </Button>
          )}
          

          {/* Total Records */}
          <span className="text-sm text-muted-foreground">
            Total: {totalRecords.toLocaleString()} data
          </span>
        </div>
      </div>

      {/* Additional Filters */}
      {showAdditionalFilters && additionalFilters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 border rounded-lg">
          {additionalFilters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <label className="text-sm font-medium">{filter.label}</label>
              {filter.type === 'select' && filter.options ? (
                <select
                  value={String(currentFilters[filter.key] || '')}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full h-9 px-3 py-1 text-sm border border-input rounded-md bg-transparent"
                >
                  <option value="">Semua</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={filter.type}
                  placeholder={filter.placeholder}
                  value={String(currentFilters[filter.key] || '')}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
