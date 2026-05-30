import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchStore, fetchStoreFeed } from '../../api/stores';
import { useMapStore } from '../../stores/mapStore';
import { BottomSheet } from '../ui/BottomSheet';
import { Spinner } from '../ui/Spinner';
import { ProductCard } from '../products/ProductCard';
import { TweetCard } from '../feed/TweetCard';
import { formatRelativeTime, getStoreTypeLabel, getConfirmedByLabel } from '../../utils/formatters';

export function StoreInfoPanel() {
  const { selectedStore, setSelectedStore } = useMapStore();
  const [activeTab, setActiveTab] = useState<'products' | 'sns'>('products');

  const { data: storeDetail, isLoading: storeLoading } = useQuery({
    queryKey: ['store', selectedStore?.id],
    queryFn: () => fetchStore(selectedStore!.id),
    enabled: !!selectedStore,
  });

  const { data: feed, isLoading: feedLoading } = useQuery({
    queryKey: ['storeFeed', selectedStore?.id],
    queryFn: () => fetchStoreFeed(selectedStore!.id),
    enabled: !!selectedStore && activeTab === 'sns',
  });

  if (!selectedStore) return null;

  return (
    <BottomSheet
      isOpen={!!selectedStore}
      onClose={() => setSelectedStore(null)}
      title={selectedStore.name}
    >
      <div className="store-panel">
        <div className="store-panel-meta">
          <span className="store-type-badge">{getStoreTypeLabel(selectedStore.storeType)}</span>
          <span className="store-address">{selectedStore.address}</span>
        </div>
        <p className="store-updated">
          最終更新: {formatRelativeTime(selectedStore.lastUpdated)}
        </p>

        <div className="store-panel-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            商品 ({selectedStore.products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'sns' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sns')}
          >
            SNS口コミ
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="store-products">
            {storeLoading ? (
              <div className="center-spinner"><Spinner /></div>
            ) : (
              storeDetail?.products.map((sp: any) =>
                sp.product ? (
                  <div key={sp.productId} className="store-product-item">
                    <ProductCard product={sp.product} compact />
                    <span className="confirmed-badge confirmed-by-{sp.confirmedBy}">
                      {getConfirmedByLabel(sp.confirmedBy)}確認
                    </span>
                  </div>
                ) : null
              )
            )}
          </div>
        )}

        {activeTab === 'sns' && (
          <div className="store-feed">
            {feedLoading ? (
              <div className="center-spinner"><Spinner /></div>
            ) : feed?.posts?.length === 0 ? (
              <p className="no-posts">SNS投稿がまだありません</p>
            ) : (
              feed?.posts?.map((post: any) => (
                <TweetCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
