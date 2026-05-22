import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AuthShell from './components/AuthShell';
import Layout from './components/Layout';
import GlobalMap from './routes/GlobalMap';
import ExpertsDirectoryPage from './routes/ExpertsDirectoryPage';
import AssetsDirectoryPage from './routes/AssetsDirectoryPage';
import ActivitySubmissionPage from './routes/ActivitySubmissionPage';

export default function App() {
  return (
    <AuthShell>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<GlobalMap />} />
              <Route path="/experts" element={<ExpertsDirectoryPage />} />
              <Route path="/assets" element={<AssetsDirectoryPage />} />
              <Route path="/submit-activity" element={<ActivitySubmissionPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthShell>
  );
}
