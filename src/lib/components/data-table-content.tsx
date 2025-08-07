import * as React from "react"
import {
  flexRender,
  type Table as TanStackTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Checkbox } from "./ui/checkbox"

interface DataTableContentProps<TData, TValue> {
  table: TanStackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  isLoading: boolean
  isFetchingNextPage: boolean
  hasMore: boolean
  loadMoreRef: React.RefObject<HTMLDivElement | null>
  pageSize: number
  dataLength: number
  columnOrder: string[]
  setColumnOrder: (order: string[]) => void
  searchQuery: string
  renderSubComponent?: (row: Row<TData>) => React.ReactNode
}

export function DataTableContent<TData, TValue>({
  table,
  isLoading,
  isFetchingNextPage,
  hasMore,
  loadMoreRef,
  dataLength,
  searchQuery,
  renderSubComponent,
  columnOrder,
  setColumnOrder,
}: DataTableContentProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({})
  const [draggedColumn, setDraggedColumn] = React.useState<string | null>(null)

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
  }

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    // Don't allow dragging the select column
    if (columnId === 'select') {
      e.preventDefault()
      return
    }
    
    setDraggedColumn(columnId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', columnId)
    
    // Add some visual feedback
    const target = e.target as HTMLElement
    target.style.opacity = '0.5'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLElement
    target.style.background = 'rgba(59, 130, 246, 0.1)' // Light blue highlight
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.background = ''
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    
    // Clear visual feedback
    const target = e.currentTarget as HTMLElement
    target.style.background = ''
    
    if (!draggedColumn || draggedColumn === targetColumnId || targetColumnId === 'select') {
      setDraggedColumn(null)
      return
    }

    const currentOrder = [...columnOrder]
    const draggedIndex = currentOrder.indexOf(draggedColumn)
    const targetIndex = currentOrder.indexOf(targetColumnId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumn(null)
      return
    }

    // Remove dragged column and insert at target position
    currentOrder.splice(draggedIndex, 1)
    currentOrder.splice(targetIndex, 0, draggedColumn)

    setColumnOrder(currentOrder)
    setDraggedColumn(null)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    const target = e.target as HTMLElement
    target.style.opacity = ''
    setDraggedColumn(null)
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        </div>
      </div>
    )
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Tidak ada data</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `Tidak ditemukan hasil untuk "${searchQuery}"`
                : "Belum ada data yang tersedia"
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={`relative ${
                      draggedColumn === header.id ? 'opacity-50' : ''
                    } ${
                      header.column.getCanSort() || header.id !== 'select' ? 'cursor-move' : ''
                    }`}
                    draggable={header.id !== 'select'}
                    onDragStart={(e) => handleDragStart(e, header.id)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, header.id)}
                    onDragEnd={handleDragEnd}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={`h-3 w-3 ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            />
                            <ChevronDown
                              className={`h-3 w-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
                {renderSubComponent && (
                  <TableHead className="w-12"></TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'select' ? (
                        <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                          aria-label="Select row"
                        />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                  {renderSubComponent && (
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpansion(row.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        {expandedRows[row.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                  )}
                </TableRow>
                {renderSubComponent && expandedRows[row.id] && (
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length + 1}>
                      {renderSubComponent(row)}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Load More / Loading Indicator */}
      <div className="flex items-center justify-center py-4">
        {isFetchingNextPage ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Memuat lebih banyak...</span>
          </div>
        ) : hasMore ? (
          <div ref={loadMoreRef} className="text-sm text-muted-foreground">
            Scroll untuk memuat lebih banyak data
          </div>
        ) : dataLength > 0 ? (
          <span className="text-sm text-muted-foreground">
            Menampilkan {dataLength} dari {dataLength} data
          </span>
        ) : null}
      </div>
    </div>
  )
}
