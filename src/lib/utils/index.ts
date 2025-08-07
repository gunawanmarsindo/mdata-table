import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCsv<T>(data: T[], columns: any[], filename: string = "export") {
  if (data.length === 0) {
    alert("Tidak ada data untuk diekspor");
    return;
  }

  // Extract headers from columns
  const headers = columns
    .filter(col => col.accessorKey || col.id)
    .map(col => col.header || col.accessorKey || col.id);

  // Extract data rows
  const rows = data.map(item => 
    columns
      .filter(col => col.accessorKey || col.id)
      .map(col => {
        const accessor = col.accessorKey || col.id;
        const value = (item as any)[accessor];
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      })
  );

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        // Escape cells that contain commas, quotes, or newlines
        cell.includes(',') || cell.includes('"') || cell.includes('\n')
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
