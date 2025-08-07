# @ggwan/MData Table

A reusable React DataTable component built with TanStack Table, TypeScript, and Tailwind CSS.

## Features

- ✅ **Infinite Scrolling** - Automatically load more data as you scroll
- ✅ **Search & Filtering** - Built-in search with customizable additional filters
- ✅ **Sorting** - Click column headers to sort data
- ✅ **Row Selection** - Select single or multiple rows with checkboxes
- ✅ **Column Visibility** - Toggle column visibility with dropdown menu
- ✅ **Export** - Export all data or selected rows to CSV
- ✅ **Bulk Actions** - Perform actions on selected rows
- ✅ **Customizable** - Flexible styling and configuration
- ✅ **TypeScript** - Full TypeScript support with proper types
- ✅ **Responsive** - Works on mobile and desktop
- ✅ **Local Storage** - Remembers table state and filters
- ✅ **Client-side & Server-side** - Supports both pagination modes

## Installation

```bash
npm install @ggwan/mdata-table
# or
pnpm add @ggwan/mdata-table
# or
yarn add @ggwan/mdata-table
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom @tanstack/react-table lucide-react
```

## Usage

### Basic Example

```tsx
import { DataTable } from '@ggwan/mdata-table'
import type { ColumnDef } from '@tanstack/react-table'

interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
  website: string
}
}

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
    header: 'Name',
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
    header: 'Phone',
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

function MyComponent() {
  return (
    <DataTable
      columns={columns}
      endpoint="https://jsonplaceholder.typicode.com/users"
      tableId="users-table"
      pageSize={5}
      enableExport={true}
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
  )
}
```

### Using the Hook Directly

```tsx
import { useDataTable } from '@ggwan/mdata-table'

function CustomTable() {
  const {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    sorting,
    setSorting,
    totalRecords,
    exportData,
    resetAllFilters,
  } = useDataTable({
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    pageSize: 10,
    tableId: 'my-table',
  })

  // Your custom table implementation
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* Your custom table JSX */}
      <div>Total: {totalRecords} records</div>
    </div>
  )
}
## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData>[]` | **required** | Column definitions using TanStack Table format |
| `endpoint` | `string` | **required** | API endpoint URL for data fetching |
| `tableId` | `string` | **required** | Unique identifier for the table (used for localStorage) |
| `pageSize` | `number` | `20` | Number of items per page |
| `enableExport` | `boolean` | `false` | Enable export functionality |
| `additionalFilters` | `AdditionalFilter[]` | `[]` | Additional filter controls |
| `onBulkDelete` | `() => void` | `undefined` | Callback for bulk delete action |
| `onBulkExportSelected` | `() => void` | `undefined` | Callback for exporting selected rows |

### AdditionalFilter

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Filter field key |
| `label` | `string` | Display label for the filter |
| `type` | `'text' \| 'select' \| 'number'` | Filter input type |
| `placeholder` | `string` | Placeholder text (for text/number inputs) |
| `options` | `Array<{value: string, label: string}>` | Options for select filters |

### useDataTable Hook

#### Parameters
```typescript
interface UseDataTableOptions {
  endpoint: string
  pageSize: number
  tableId: string
}
```

#### Returns
```typescript
interface UseDataTableReturn<TData> {
  data: TData[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  isLoading: boolean
  isFetchingNextPage: boolean
  sorting: SortingState | null
  setSorting: (sorting: SortingState | null) => void
  hasMore: boolean
  filters: FilterState
  handleFilterChange: (key: string, value: string | number | boolean) => void
  showAdditionalFilters: boolean
  setShowAdditionalFilters: (show: boolean) => void
  loadMoreRef: React.RefObject<HTMLDivElement>
  totalRecords: number
  resetAllFilters: () => void
  exportData: () => Promise<TData[]>
  isExporting: boolean
  rowSelection: Record<string, boolean>
  setRowSelection: (selection: Record<string, boolean>) => void
}
```

## API Response Format

The DataTable supports two response formats:

### 1. Array Response (like JSONPlaceholder)
```json
[
  { "id": 1, "name": "John", "email": "john@example.com" },
  { "id": 2, "name": "Jane", "email": "jane@example.com" }
]
```

### 2. Object Response (with pagination)
```json
{
  "data": [
    { "id": 1, "name": "John", "email": "john@example.com" }
  ],
  "total": 100,
  "hasMore": true,
  "next_page_url": "https://api.example.com/users?page=2"
}
```

## Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Using CSS Variables**: Override the built-in CSS variables
2. **Custom Classes**: Pass custom className props
3. **Tailwind Config**: Extend your Tailwind configuration

### CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --muted: 210 40% 96%;
  --border: 214.3 31.8% 91.4%;
```

## TypeScript Support

This package is written in TypeScript and provides full type safety. All types are exported:

```tsx
import type { 
  AdditionalFilter, 
  FilterState, 
  SortingState, 
  UseDataTableOptions,
  UseDataTableReturn 
} from '@ggwan/mdata-table'
```

## Features in Detail

### 🔍 Search & Filtering
- **Global search**: Search across all visible columns
- **Additional filters**: Add custom filter controls (text, select, number)
- **Real-time filtering**: Results update as you type
- **Filter persistence**: Filters are remembered in localStorage

### 📊 Sorting
- **Column sorting**: Click any column header to sort
- **Multi-directional**: Ascending, descending, and no sort
- **Type-aware**: Proper sorting for strings, numbers, and dates
- **Sort persistence**: Last sort order is remembered

### 🎯 Row Selection
- **Individual selection**: Click checkbox on any row
- **Select all**: Master checkbox to select all visible rows
- **Bulk actions**: Perform actions on multiple selected rows
- **Selection persistence**: Selections maintained during pagination

### 📱 Responsive Design
- **Mobile-friendly**: Optimized for small screens
- **Touch interactions**: Proper touch targets for mobile
- **Adaptive layout**: Adjusts to different screen sizes

### ⚡ Performance
- **Infinite scrolling**: Smooth pagination without page reloads
- **Client-side optimization**: Smart filtering and sorting
- **Lazy loading**: Only render visible rows
- **Memory efficient**: Proper cleanup and state management

## Troubleshooting

### Common Issues

1. **Styles not loading**: Make sure to import the CSS
2. **TypeScript errors**: Ensure all peer dependencies are installed
3. **Data not showing**: Check your API response format
4. **Filtering not working**: Verify filter key matches your data structure

### Debug Mode
Enable debug logging by setting localStorage:
```javascript
localStorage.setItem('mdata-table-debug', 'true')
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- DataTable component with infinite scrolling
- Search and filtering capabilities
- Row selection and bulk actions
- Export functionality
- Column visibility toggle
- TypeScript support
- Responsive design
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

function MyComponent() {
  return (
    <DataTable
      columns={columns}
      endpoint="/api/users"
      tableId="users-table"
      pageSize={20}
      enableExport={true}
      additionalFilters={[
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ],
        },
        {
          key: 'department',
          label: 'Department',
          type: 'text',
          placeholder: 'Search by department...',
        },
      ]}
      renderSubComponent={(row) => (
        <div className="p-4 bg-gray-50">
          <h4>User Details</h4>
          <p>ID: {row.original.id}</p>
          <p>Email: {row.original.email}</p>
        </div>
      )}
    />
  )
}
```

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | - | **Required.** Column definitions for the table |
| `endpoint` | `string` | - | **Required.** API endpoint for fetching data |
| `tableId` | `string` | - | **Required.** Unique identifier for the table (used for localStorage) |
| `pageSize` | `number` | `5` | Number of items per page |
| `additionalFilters` | `AdditionalFilter[]` | `[]` | Additional filter options |
| `enableExport` | `boolean` | `false` | Enable CSV export functionality |
| `renderSubComponent` | `(row: Row<TData>) => ReactNode` | - | Render expandable row content |

### API Response Format

Your API endpoint should return data in this format:

```json
{
  "data": [...], // Array of data items
  "total": 100,  // Total number of records
  "hasMore": true // Whether there are more pages
}
```

### API Parameters

The component will send these query parameters to your endpoint:

- `page` - Current page number
- `limit` - Items per page
- `search` - Search query
- `sortBy` - Column to sort by
- `sortOrder` - Sort direction ('asc' or 'desc')
- Additional filter parameters

## Styling

This component uses Tailwind CSS. Make sure to include the styles in your project:

```tsx
import 'mdata-table/styles'
```

Or if you want to customize the styles, you can import the base CSS and override with your own classes.

## TypeScript

The package includes full TypeScript definitions. Key types:

```tsx
import type {
  AdditionalFilter,
  FilterState,
  SortingState,
  UseDataTableReturn,
  UseDataTableOptions
} from 'mdata-table'
```

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
