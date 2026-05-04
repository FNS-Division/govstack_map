import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';

interface SheetPageProps {
  sheetKeyword: string;
  title: string;
}

export default function SheetPage({ sheetKeyword, title }: SheetPageProps) {
  const { sheets, loading, error } = useData();

  const sheetKey = Object.keys(sheets).find(k =>
    k.toLowerCase().includes(sheetKeyword.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: '3px solid #e2eaf2', borderTopColor: '#009EDB' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-sm" style={{ color: '#E63946' }}>
        Failed to load data: {error}
      </div>
    );
  }

  if (!sheetKey) {
    return (
      <div className="text-center py-12 text-sm text-gray-400">
        Sheet "{title}" not found in the Excel file.
      </div>
    );
  }

  const sheet = sheets[sheetKey];

  return (
    <DataTable
      headers={sheet.headers}
      rows={sheet.rows}
      title={title}
    />
  );
}
