import { OverlayView } from '@react-google-maps/api';
import type { StoreLocation } from '../../api/types';
import { getPinColor } from '../../utils/formatters';

interface StoreMarkerProps {
  store: StoreLocation;
  onClick: () => void;
}

export function StoreMarker({ store, onClick }: StoreMarkerProps) {
  const color = getPinColor(store.lastUpdated);
  const count = store.products.length;

  return (
    <OverlayView
      position={{ lat: store.lat, lng: store.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <button
        className="store-marker"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        title={store.name}
        style={{ '--pin-color': color } as React.CSSProperties}
        aria-label={`${store.name} - ${count}種類`}
      >
        <div className="store-marker-pin" style={{ backgroundColor: color, borderColor: color }}>
          <span className="store-marker-count">{count}</span>
        </div>
        <div className="store-marker-triangle" style={{ borderTopColor: color }} />
        <div className="store-marker-label">{store.city}</div>
      </button>
    </OverlayView>
  );
}
