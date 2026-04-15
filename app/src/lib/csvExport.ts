type CsvValue = string | number | boolean | null | undefined;

export type CsvRow = Record<string, CsvValue>;

function escapeCsvCell(value: CsvValue): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function rowsToCsv(rows: CsvRow[], headers?: string[]): string {
  if (rows.length === 0) return '';
  const keys = headers ?? Object.keys(rows[0]);
  const headerLine = keys.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) =>
    keys.map((key) => escapeCsvCell(row[key])).join(',')
  );
  return [headerLine, ...dataLines].join('\r\n');
}

export function downloadCsv(filename: string, rows: CsvRow[], headers?: string[]): void {
  const csv = rowsToCsv(rows, headers);
  // Prepend UTF-8 BOM so Excel reads non-ASCII characters correctly
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
