import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AuthShell from './components/AuthShell';
import Layout from './components/Layout';
import GlobalMap from './routes/GlobalMap';
import ExpertsDirectoryPage from './routes/ExpertsDirectoryPage';
import AssetsLibraryPage from './components/assets/AssetsLibraryPage';
import ActivitySubmissionPage from './routes/ActivitySubmissionPage';
import AdminRoute from './components/AdminRoute';
import SubmissionsReviewPage from './routes/SubmissionsReviewPage';

export default function App() {
  return (
    <AuthShell>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<GlobalMap />} />
              <Route path="/experts" element={<ExpertsDirectoryPage />} />
              <Route path="/assets" element={<AssetsLibraryPage />} />
              <Route path="/assets/:category" element={<AssetsLibraryPage />} />
              <Route path="/submit-activity" element={<ActivitySubmissionPage />} />
              <Route
                path="/admin/submissions"
                element={
                  <AdminRoute>
                    <SubmissionsReviewPage />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthShell>
  );
}
