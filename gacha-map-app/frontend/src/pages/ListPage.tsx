import { useQuery } from '@tanstack/react-query';
import { fetchStores } from '../api/stores';
import { useMapStore } from '../stores/mapStore';
import { useFilterStore } from '../stores/filterStore';
import { Spinner } from '../components/ui/Spinner';
import { formatRelativeTime, getPinColor, getStoreTypeLabel } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export function ListPage() {
  const { setSelectedStore, setMapCenter, setZoom } = useMapStore();
  const { manufacturer, series } = useFilterStore();
  const navigate = useNavigate();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ['stores', null, manufacturer, series],
    queryFn: () =>
      fetchStores({
        manufacturer: manufacturer || undefined,
        series: series || undefined,
      }),
    staleTime: 60000,
  });

  function handleStoreClick(store: any) {
    setSelectedStore(store);
    setMapCenter({ lat: store.lat, lng: store.lng });
    setZoom(15);
    navigate('/');
  }

  const grouped = stores.reduce(
    (acc: Record<string, typeof stores>, store) => {
      const pref = store.prefecture;
      if (!acc[pref]) acc[pref] = [];
      acc[pref].push(store);
      return acc;
    },
    {}
  );

  return (
    <div className="list-page">
      <div className="list-header">
        <h2 className="list-title">店舗一覧</h2>
        <span className="list-count">{stores.length}件</span>
      </div>

      {isLoading ? (
        <div className="center-spinner"><Spinner size={40} /></div>
      ) : (
        Object.entries(grouped).map(([pref, prefStores]) => (
          <div key={pref} className="store-group">
            <h3 className="store-group-label">{pref}</h3>
            {prefStores.map((store) => {
              const pinColor = getPinColor(store.lastUpdated);
              return (
                <button
                  key={store.id}
                  className="store-list-item"
                  onClick={() => handleStoreClick(store)}
                >
                  <div className="store-list-indicator" style={{ backgroundColor: pinColor }} />
                  <div className="store-list-info">
                    <p className="store-list-name">{store.name}</p>
                    <p className="store-list-address">{store.address}</p>
                    <div className="store-list-meta">
                      <span className="store-type-chip">{getStoreTypeLabel(store.storeType)}</span>
                      <span className="store-product-count">{store.products.length}種類</span>
                      <span className="store-updated-time">
                        {formatRelativeTime(store.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  <span className="store-list-arrow">›</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
