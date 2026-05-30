import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFilterStore } from '../../stores/filterStore';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <span className="app-logo-icon">🎰</span>
            <span className="app-logo-text">ガチャガチャマップ</span>
          </div>
          <button
            className="header-search-btn"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="検索"
          >
            🔍
          </button>
        </div>
        {showSearch && (
          <div className="header-search-bar">
            <input
              type="search"
              placeholder="商品・シリーズ・メーカーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        )}
      </header>

      <main className="app-main">{children}</main>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'nav-active' : ''}`}>
          <span className="nav-icon">🗺️</span>
          <span className="nav-label">マップ</span>
        </Link>
        <Link
          to="/search"
          className={`nav-item ${location.pathname === '/search' ? 'nav-active' : ''}`}
        >
          <span className="nav-icon">🔍</span>
          <span className="nav-label">商品検索</span>
        </Link>
        <Link
          to="/list"
          className={`nav-item ${location.pathname === '/list' ? 'nav-active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">店舗一覧</span>
        </Link>
        <Link
          to="/feed"
          className={`nav-item ${location.pathname === '/feed' ? 'nav-active' : ''}`}
        >
          <span className="nav-icon">📣</span>
          <span className="nav-label">新着</span>
        </Link>
      </nav>
    </div>
  );
}
