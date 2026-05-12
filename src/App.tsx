import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import GlobalMap from './routes/GlobalMap';
import SheetPage from './routes/SheetPage';

export default function App() {
  return (
    <Authenticator hideSignUp>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
    </Authenticator>
  );
}
