import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { MapPage } from './pages/MapPage';
import { SearchPage } from './pages/SearchPage';
import { ListPage } from './pages/ListPage';
import { FeedPage } from './pages/FeedPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/feed" element={<FeedPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
