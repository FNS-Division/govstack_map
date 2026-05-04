import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadExcel, type SheetData } from '../utils/excelLoader';

interface DataContextType {
  sheets: Record<string, SheetData>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  sheets: {},
  loading: true,
  error: null,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sheets, setSheets] = useState<Record<string, SheetData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExcel('/data/GovStack Global .xlsx')
      .then(data => {
        setSheets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ sheets, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
