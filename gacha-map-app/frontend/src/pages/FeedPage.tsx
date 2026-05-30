import { useQuery } from '@tanstack/react-query';
import { fetchRecentSightings } from '../api/sightings';
import { fetchReleases } from '../api/products';
import { TweetCard } from '../components/feed/TweetCard';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../utils/formatters';

export function FeedPage() {
  const { data: sightings = [], isLoading: sightingsLoading } = useQuery({
    queryKey: ['recentSightings'],
    queryFn: fetchRecentSightings,
    refetchInterval: 60000,
  });

  const { data: releases = [], isLoading: releasesLoading } = useQuery({
    queryKey: ['releases'],
    queryFn: fetchReleases,
    staleTime: 300000,
  });

  return (
    <div className="feed-page">
      {/* 新着リリース */}
      <section className="feed-section">
        <h2 className="feed-section-title">
          <span className="feed-section-icon">🆕</span>
          最新リリース情報
        </h2>
        {releasesLoading ? (
          <div className="center-spinner"><Spinner /></div>
        ) : (
          <div className="releases-list">
            {releases.map((release) => (
              <div key={release.id} className="release-card">
                <div className="release-header">
                  <span className="release-manufacturer">{release.manufacturer}</span>
                  <span className="release-date">{formatDate(release.releaseDate)}</span>
                </div>
                <h3 className="release-title">{release.title}</h3>
                <p className="release-desc">{release.description}</p>
                <a
                  href={release.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="release-link"
                >
                  公式ページを確認 →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SNS口コミ */}
      <section className="feed-section">
        <h2 className="feed-section-title">
          <span className="feed-section-icon">📣</span>
          SNS口コミ 新着
        </h2>
        {sightingsLoading ? (
          <div className="center-spinner"><Spinner /></div>
        ) : (
          <div className="sightings-list">
            {sightings.map((post) => (
              <TweetCard key={post.id} post={post} showLocation />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
