import type { RefObject } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useMapStore } from '../../stores/mapStore';
import { Spinner } from '../ui/Spinner';

interface MapControlsProps {
  mapRef: RefObject<google.maps.Map | null>;
}

export function MapControls({ mapRef }: MapControlsProps) {
  const { locate, loading } = useGeolocation();
  const { setMapCenter, setZoom } = useMapStore();

  function handleNearMe() {
    locate();
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      const center = { lat: coords.latitude, lng: coords.longitude };
      setMapCenter(center);
      setZoom(14);
      mapRef.current?.panTo(center);
      mapRef.current?.setZoom(14);
    });
  }

  return (
    <div className="map-controls">
      <button
        className="map-control-btn near-me-btn"
        onClick={handleNearMe}
        disabled={loading}
        aria-label="現在地に移動"
        title="現在地を探す"
      >
        {loading ? <Spinner size={18} /> : '📍'}
        <span>現在地</span>
      </button>
    </div>
  );
}
