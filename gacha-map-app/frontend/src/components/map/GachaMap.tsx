import { useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { getPinColor } from '../../utils/formatters';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchStores } from '../../api/stores';
import { useMapStore } from '../../stores/mapStore';
import { useFilterStore } from '../../stores/filterStore';
import { StoreMarker } from './StoreMarker';
import { MapControls } from './MapControls';
import { Spinner } from '../ui/Spinner';
import type { StoreLocation } from '../../api/types';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  ],
};

export function GachaMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    language: 'ja',
  });

  const { mapCenter, zoom, bounds, setBounds, setSelectedStore, setMapCenter, setZoom } =
    useMapStore();
  const { manufacturer, series } = useFilterStore();
  const mapRef = useRef<google.maps.Map | null>(null);

  const boundsDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: stores = [], isFetching } = useQuery({
    queryKey: ['stores', bounds, manufacturer, series],
    queryFn: () =>
      fetchStores({ ...bounds, manufacturer: manufacturer || undefined, series: series || undefined }),
    enabled: bounds !== null || (!manufacturer && !series),
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
    },
    []
  );

  const onBoundsChanged = useCallback(() => {
    if (!mapRef.current) return;
    if (boundsDebounceRef.current) clearTimeout(boundsDebounceRef.current);
    boundsDebounceRef.current = setTimeout(() => {
      const b = mapRef.current!.getBounds();
      if (!b) return;
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      setBounds({ swLat: sw.lat(), swLng: sw.lng(), neLat: ne.lat(), neLng: ne.lng() });
    }, 300);
  }, [setBounds]);

  const handleStoreClick = useCallback(
    (store: StoreLocation) => {
      setSelectedStore(store);
    },
    [setSelectedStore]
  );

  if (loadError) {
    return (
      <div className="map-error">
        <div className="map-error-content">
          <div className="map-error-icon">🗺️</div>
          <h3>地図の読み込みに失敗しました</h3>
          <p>Google Maps APIキーを設定してください。</p>
          <p className="map-error-sub">デモデータは右パネルで確認できます。</p>
        </div>
        <DemoMapFallback stores={stores} onStoreClick={handleStoreClick} />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <Spinner size={40} />
        <p>地図を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={mapCenter}
        zoom={zoom}
        options={MAP_OPTIONS}
        onLoad={onMapLoad}
        onBoundsChanged={onBoundsChanged}
        onCenterChanged={() => {
          if (mapRef.current) {
            const c = mapRef.current.getCenter();
            if (c) setMapCenter({ lat: c.lat(), lng: c.lng() });
          }
        }}
        onZoomChanged={() => {
          if (mapRef.current) setZoom(mapRef.current.getZoom() ?? 11);
        }}
      >
        {stores.map((store) => (
          <StoreMarker
            key={store.id}
            store={store}
            onClick={() => handleStoreClick(store)}
          />
        ))}
      </GoogleMap>

      <MapControls mapRef={mapRef} />

      {isFetching && (
        <div className="map-refresh-indicator">
          <Spinner size={16} />
          <span>更新中...</span>
        </div>
      )}
    </div>
  );
}

// No Google Maps API key fallback — SVG-based visual map
function DemoMapFallback({
  stores,
  onStoreClick,
}: {
  stores: StoreLocation[];
  onStoreClick: (s: StoreLocation) => void;
}) {
  const tokyoStores = stores.filter((s) => s.prefecture === '東京都');
  const osakaStores = stores.filter((s) => s.prefecture === '大阪府');
  const otherStores = stores.filter(
    (s) => s.prefecture !== '東京都' && s.prefecture !== '大阪府'
  );

  return (
    <div className="demo-map">
      <div className="demo-map-header">
        <span>デモマップ（APIキーなし）</span>
      </div>
      <div className="demo-map-cities">
        {[
          { label: '東京', stores: tokyoStores },
          { label: '大阪', stores: osakaStores },
          { label: 'その他', stores: otherStores },
        ].map(({ label, stores: cityStores }) => (
          <div key={label} className="demo-map-city">
            <h4 className="demo-map-city-label">{label}</h4>
            <div className="demo-map-pins">
              {cityStores.map((store) => (
                <button
                  key={store.id}
                  className="demo-map-pin"
                  onClick={() => onStoreClick(store)}
                  title={store.name}
                  style={{ borderColor: getPinColor(store.lastUpdated) }}
                >
                  <span
                    className="demo-map-pin-dot"
                    style={{ backgroundColor: getPinColor(store.lastUpdated) }}
                  />
                  <span className="demo-map-pin-label">{store.city}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
