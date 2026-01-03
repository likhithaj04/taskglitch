import { Task } from '@/types';

export function toCSV(tasks: ReadonlyArray<Task>): string {
  //  FIXED: Use explicit, stable header order
  const headers = ['id', 'title', 'revenue', 'timeTaken', 'priority', 'status', 'notes', 'createdAt', 'completedAt'];
  
  //  FIXED: Map to stable column order matching headers
  const rows = tasks.map(t => [
    t.id,
    escapeCsv(t.title),
    String(t.revenue),
    String(t.timeTaken),
    t.priority,
    t.status,
    escapeCsv(t.notes ?? ''),
    t.createdAt,
    t.completedAt ?? '',
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCsv(v: string): string {
  // FIXED: Properly escape quotes and handle all special characters
  // Quote if contains: comma, newline, carriage return, or double quote
  if (v.includes(',') || v.includes('\n') || v.includes('\r') || v.includes('"')) {
    // Escape double quotes by doubling them (CSV standard)
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


