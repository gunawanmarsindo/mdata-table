import type { Table } from "@tanstack/react-table"
import { Search, Filter, RotateCcw, Download, Trash2, Settings2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
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

  return (
    <div className="space-y-4">
      {/* Enhanced Main toolbar */}
      <div className="flex flex-col gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-72 h-10 bg-background/60 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            {/* Filter Toggle with badge */}
            {additionalFilters.length > 0 && (
              <Button
                variant={showAdditionalFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
                className="gap-2 h-10 px-4"
              >
                <Filter className="h-4 w-4" />
                Filter
                {Object.values(currentFilters).some(value => 
                  value !== undefined && value !== '' && value !== null
                ) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {Object.values(currentFilters).filter(value => 
                      value !== undefined && value !== '' && value !== null
                    ).length}
                  </span>
                )}
              </Button>
            )}

            {/* Reset with enhanced styling */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="gap-2 h-10 px-4 hover:bg-muted/80"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Enhanced Record Count */}
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
              <span className="font-medium text-foreground">{totalRecords.toLocaleString()}</span> data
            </div>

            {/* Bulk Actions with improved styling */}
            {selectedRowCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md">
                <span className="text-sm font-medium text-primary">
                  {selectedRowCount} dipilih
                </span>
                {onBulkDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onBulkDelete}
                    className="h-8 px-3"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Hapus
                  </Button>
                )}
                {onBulkExportSelected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBulkExportSelected}
                    className="h-8 px-3 border-primary/30 hover:bg-primary/10"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Ekspor
                  </Button>
                )}
              </div>
            )}

            {/* Enhanced Export */}
            {enableExport && onExport && (
              <Button
                onClick={onExport}
                disabled={isExporting}
                variant="outline"
                size="sm"
                className="gap-2 h-10 px-4 bg-background/60 hover:bg-background/80 border-border/60"
              >
                <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
                {isExporting ? 'Mengekspor...' : 'Ekspor CSV'}
              </Button>
            )}

            {/* Enhanced Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2 h-10 px-4 bg-background/60 hover:bg-background/80 border-border/60"
                >
                  <Settings2 className="h-4 w-4" />
                  Kolom
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {(column.columnDef.header as string) || column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Enhanced Additional Filters */}
      {showAdditionalFilters && additionalFilters.length > 0 && (
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {additionalFilters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">{filter.label}</label>
                {filter.type === 'select' && filter.options ? (
                  <select
                    value={String(currentFilters[filter.key] || '')}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm border border-border/60 rounded-md bg-background/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
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
                    className="h-10 bg-background/60 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
