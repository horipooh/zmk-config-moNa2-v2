import { useQuery } from '@tanstack/react-query';
import { fetchManufacturers, fetchSeries } from '../../api/products';
import { useFilterStore } from '../../stores/filterStore';
import { Chip } from '../ui/Chip';

export function ProductFilterBar() {
  const { manufacturer, series, setManufacturer, setSeries, clearFilters } = useFilterStore();

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchManufacturers,
    staleTime: Infinity,
  });

  const { data: seriesList = [] } = useQuery({
    queryKey: ['series', manufacturer],
    queryFn: () => fetchSeries(manufacturer || undefined),
    staleTime: Infinity,
  });

  const manufacturerColors: Record<string, string> = {
    BANDAI: '#e11d48',
    'TAKARA TOMY ARTS': '#2563eb',
    EPOCH: '#16a34a',
  };

  const hasFilters = manufacturer || series;

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">メーカー</span>
        <div className="filter-chips">
          {manufacturers.map((m) => (
            <Chip
              key={m}
              label={m}
              active={manufacturer === m}
              color={manufacturerColors[m]}
              onClick={() => setManufacturer(manufacturer === m ? '' : m)}
            />
          ))}
          {hasFilters && (
            <button className="clear-filter-btn" onClick={clearFilters}>
              ✕ クリア
            </button>
          )}
        </div>
      </div>

      {manufacturer && seriesList.length > 0 && (
        <div className="filter-row">
          <span className="filter-label">シリーズ</span>
          <div className="filter-chips">
            {seriesList.map((s) => (
              <Chip
                key={s}
                label={s}
                active={series === s}
                onClick={() => setSeries(series === s ? '' : s)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
