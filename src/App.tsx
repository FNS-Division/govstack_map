import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import GlobalMap from './routes/GlobalMap';
import ExpertsDirectoryPage from './routes/ExpertsDirectoryPage';
import AssetsDirectoryPage from './routes/AssetsDirectoryPage';

export default function App() {
  return (
    <Authenticator hideSignUp>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<GlobalMap />} />
            <Route path="/experts" element={<ExpertsDirectoryPage />} />
            <Route path="/assets" element={<AssetsDirectoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
    </Authenticator>
  );
}
