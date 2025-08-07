import './index.css'
import { DataTable } from './lib/components/data-table'
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

// Sample columns definition - using available fields from JSONPlaceholder
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nama',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'phone',
    header: 'Telepon',
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
          className="text-blue-600 hover:underline"
        >
          {website}
        </a>
      );
    },
  },
]

// Mock API endpoint - replace with your actual API
const mockEndpoint = 'http://localhost:3000/api/proxy/student/tugas'

function App() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">MData Table Demo</h1>
          <p className="text-muted-foreground mt-2">
            A reusable React DataTable component built with TanStack Table
          </p>
        </div>

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
    </div>
  )
}

export default App
