import './index.css'
import { DataTable } from './lib/components/data-table'
import { Checkbox } from './lib/components/ui/checkbox'
import type { ColumnDef } from '@tanstack/react-table'

// Sample data type - matching JSONPlaceholder API
interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
}

// Enhanced columns with better styling
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nama',
    cell: ({ row }) => (
      <div className="font-medium text-foreground">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className="text-muted-foreground hover:text-primary transition-colors">
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => (
      <div className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
        @{row.getValue('username')}
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Telepon',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue('phone')}
      </div>
    ),
  },
  {
    accessorKey: 'website',
    header: 'Website',
    cell: ({ getValue }) => {
      const website = getValue() as string;
      return (
        <a 
          href={`https://${website}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
        >
          {website}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    },
  },
]

// Mock API endpoint - replace with your actual API
const mockEndpoint = 'https'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-8">
          {/* Enhanced Header */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                MData Table Demo
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A modern, feature-rich React DataTable component built with TanStack Table, 
                shadcn/ui, and enhanced with beautiful styling and interactions.
              </p>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                '🔍 Advanced Search',
                '🎛️ Filters & Sorting', 
                '📱 Responsive Design',
                '🎨 Modern UI',
                '⚡ Drag & Drop Columns',
                '💾 State Persistence'
              ].map((feature, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced DataTable Container */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg p-6">
            <DataTable
              columns={columns}
              endpoint={mockEndpoint}
              pageSize={5}
              enableExport={true}
              tableId="users-table"
              additionalFilters={[
                {
                  key: 'username',
                  label: 'Username',
                  type: 'text',
                  placeholder: 'Filter by username...',
                },
                {
                  key: 'email',
                  label: 'Email',
                  type: 'text',
                  placeholder: 'Filter by email...',
                },
              ]}
            />
          </div>
          
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ using React, TanStack Table, and shadcn/ui</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
