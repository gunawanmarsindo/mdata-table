# Publishing Guide for MData Table

## Prerequisites

1. **NPM Account**: Make sure you have an npm account and are logged in
   ```bash
   npm login
   ```

2. **Package Name**: Update the package name in `package.json` if "mdata-table" is already taken
   ```json
   {
     "name": "@yourusername/mdata-table"
   }
   ```

## Publishing Steps

### 1. Test the Package Locally

Before publishing, test your package locally:

```bash
# Build the package
npm run build:lib

# Create a tarball to inspect
npm pack

# Test in another project
npm install /path/to/your/mdata-table-1.0.0.tgz
```

### 2. Update Version

```bash
# For patch version (1.0.0 -> 1.0.1)
npm version patch

# For minor version (1.0.0 -> 1.1.0)  
npm version minor

# For major version (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publish to NPM

```bash
# Public package
npm publish

# Scoped package  
npm publish --access public
```

### 4. Verify Publication

Check your package at: https://www.npmjs.com/package/mdata-table

## Usage After Publishing

### Installation

```bash
npm install mdata-table
# or
pnpm add mdata-table
# or
yarn add mdata-table
```

### Basic Usage

```tsx
import { DataTable } from 'mdata-table'
import 'mdata-table/dist/style.css' // Import styles

// Define your columns
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  // ... more columns
]

// Use the component
function MyApp() {
  return (
    <DataTable
      columns={columns}
      endpoint="/api/data"
      tableId="my-table"
    />
  )
}
```

## Package Contents

- `dist/index.js` - ES module build
- `dist/index.cjs` - CommonJS build
- `dist/index.d.ts` - TypeScript declarations
- `dist/style.css` - Component styles

## Troubleshooting

### 1. Name Already Taken

If the package name is taken, use a scoped name:
```json
{
  "name": "@yourusername/mdata-table"
}
```

### 2. 403 Forbidden

Make sure you're logged into npm:
```bash
npm whoami
npm login
```

### 3. Build Errors

Check peer dependencies and ensure TypeScript is properly configured.

## Maintenance

### Updating

1. Make changes to source code
2. Test changes with `npm run dev`
3. Build with `npm run build:lib` 
4. Bump version with `npm version patch/minor/major`
5. Publish with `npm publish`

### Managing Versions

- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features, backwards compatible
- **Major** (x.0.0): Breaking changes

## Repository Settings

Make sure your `package.json` has correct repository information:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/mdata-table.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/mdata-table/issues"
  },
  "homepage": "https://github.com/yourusername/mdata-table#readme"
}
```
