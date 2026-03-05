import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UserListPage from '@/pages/users/UserListPage';
import UserDetailPage from '@/pages/users/UserDetailPage';
import LogListPage from '@/pages/logs/LogListPage';
import LogDetailPage from '@/pages/logs/LogDetailPage';
import SpotListPage from '@/pages/spots/SpotListPage';
import SpotDetailPage from '@/pages/spots/SpotDetailPage';
import ImageListPage from '@/pages/images/ImageListPage';
import ImageDetailPage from '@/pages/images/ImageDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <AntApp>
          <BrowserRouter basename="/plog-admin-frontend">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="users" element={<UserListPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="logs" element={<LogListPage />} />
                <Route path="logs/:id" element={<LogDetailPage />} />
                <Route path="spots" element={<SpotListPage />} />
                <Route path="spots/:id" element={<SpotDetailPage />} />
                <Route path="images" element={<ImageListPage />} />
                <Route path="images/:id" element={<ImageDetailPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
