import { GachaMap } from '../components/map/GachaMap';
import { StoreInfoPanel } from '../components/map/StoreInfoPanel';
import { ProductFilterBar } from '../components/products/ProductFilterBar';

export function MapPage() {
  return (
    <div className="map-page">
      <div className="map-filter-overlay">
        <ProductFilterBar />
      </div>
      <div className="map-wrap">
        <GachaMap />
      </div>
      <StoreInfoPanel />
    </div>
  );
}
