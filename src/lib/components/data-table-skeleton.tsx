import { Skeleton } from "./ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

interface DataTableSkeletonProps {
  rows?: number
  columns?: number
  showToolbar?: boolean
}

export function DataTableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showToolbar = true 
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      {showToolbar && (
        <div className="flex flex-col gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Search skeleton */}
              <Skeleton className="h-10 w-72" />
              {/* Filter button skeleton */}
              <Skeleton className="h-10 w-20" />
              {/* Reset button skeleton */}
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="flex items-center gap-3">
              {/* Record count skeleton */}
              <Skeleton className="h-6 w-16" />
              {/* Export button skeleton */}
              <Skeleton className="h-10 w-24" />
              {/* Column visibility skeleton */}
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      )}

      {/* Table skeleton */}
      <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/50">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index} className="h-12">
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={`transition-colors duration-150 ${
                  rowIndex % 2 === 0 ? 'bg-background/50' : 'bg-muted/20'
                }`}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="py-3 px-4">
                    {colIndex === 0 ? (
                      // Checkbox skeleton for first column
                      <Skeleton className="h-4 w-4 rounded" />
                    ) : (
                      // Different skeleton widths for variety
                      <Skeleton 
                        className={`h-4 ${
                          colIndex === 1 ? 'w-32' : 
                          colIndex === 2 ? 'w-48' : 
                          colIndex === 3 ? 'w-24' : 
                          'w-20'
                        }`} 
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Load more skeleton */}
      <div className="flex items-center justify-center py-6">
        <div className="flex items-center space-x-3 px-4 py-2 bg-muted/30 rounded-lg border border-border/50">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  )
}

// Simplified skeleton for inline loading states
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <TableRow className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="py-3 px-4">
          <Skeleton className={`h-4 ${
            index === 0 ? 'w-4' : 
            index === 1 ? 'w-32' : 
            index === 2 ? 'w-48' : 
            'w-24'
          }`} />
        </TableCell>
      ))}
    </TableRow>
  )
}

// Skeleton for search input with icon
export function SearchSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="absolute left-3 top-3 h-4 w-4 rounded-full" />
    </div>
  )
}

// Skeleton for filter badges
export function FilterBadgeSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  )
}

// Skeleton for button group
export function ButtonGroupSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-16" />
      <Skeleton className="h-10 w-24" />
    </div>
  )
}
