import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import { useFilterStore } from '../stores/filterStore';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilterBar } from '../components/products/ProductFilterBar';
import { Spinner } from '../components/ui/Spinner';

export function SearchPage() {
  const { manufacturer, series, searchQuery } = useFilterStore();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', manufacturer, series, searchQuery],
    queryFn: () =>
      fetchProducts({
        q: searchQuery || undefined,
        manufacturer: manufacturer || undefined,
        series: series || undefined,
      }),
    staleTime: 60000,
  });

  return (
    <div className="search-page">
      <ProductFilterBar />

      <div className="search-results">
        {isLoading ? (
          <div className="center-spinner"><Spinner size={40} /></div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🎰</div>
            <p>該当する商品が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <p className="results-count">{products.length}件の商品</p>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
