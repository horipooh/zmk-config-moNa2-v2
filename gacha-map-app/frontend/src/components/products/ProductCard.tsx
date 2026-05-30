import type { GachaProduct } from '../../api/types';
import { formatDate, formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: GachaProduct;
  compact?: boolean;
  onClick?: () => void;
}

export function ProductCard({ product, compact, onClick }: ProductCardProps) {
  const manufacturerColors: Record<string, string> = {
    BANDAI: '#e11d48',
    'TAKARA TOMY ARTS': '#2563eb',
    EPOCH: '#16a34a',
  };
  const color = manufacturerColors[product.manufacturer] ?? '#6b7280';

  if (compact) {
    return (
      <div className="product-card product-card-compact" onClick={onClick}>
        <img src={product.imageUrl} alt={product.name} className="product-img-small" loading="lazy" />
        <div className="product-compact-info">
          <p className="product-name-small">{product.name}</p>
          <div className="product-meta-small">
            <span className="manufacturer-chip" style={{ backgroundColor: color }}>
              {product.manufacturer}
            </span>
            <span className="product-price-small">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card-img-wrap">
        <img src={product.imageUrl} alt={product.name} className="product-img" loading="lazy" />
        <span className="product-category-badge">{product.category}</span>
      </div>
      <div className="product-card-body">
        <div className="product-card-header">
          <span className="manufacturer-chip" style={{ backgroundColor: color }}>
            {product.manufacturer}
          </span>
          <span className="product-series">{product.series}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-date">発売: {formatDate(product.releaseDate)}</span>
        </div>
      </div>
    </div>
  );
}
