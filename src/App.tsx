import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import GlobalMap from './routes/GlobalMap';
import SheetPage from './routes/SheetPage';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<GlobalMap />} />
            <Route
              path="/experts"
              element={<SheetPage sheetKeyword="expert" title="Experts" />}
            />
            <Route
              path="/assets"
              element={<SheetPage sheetKeyword="asset" title="Assets" />}
            />
            <Route
              path="/input-sheet"
              element={<SheetPage sheetKeyword="input" title="Input Sheet" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
