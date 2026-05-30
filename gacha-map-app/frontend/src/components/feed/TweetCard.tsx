import type { SnsPost } from '../../api/types';
import { formatRelativeTime, getPlatformIcon } from '../../utils/formatters';

interface TweetCardProps {
  post: SnsPost;
  showLocation?: boolean;
}

export function TweetCard({ post, showLocation }: TweetCardProps) {
  const platformIcon = getPlatformIcon(post.platform);

  return (
    <div className="tweet-card">
      <div className="tweet-header">
        <div className="tweet-author-info">
          <div className="tweet-platform-icon">{platformIcon}</div>
          <a
            href={post.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-author"
          >
            {post.author}
          </a>
        </div>
        <div className="tweet-meta">
          <span className="tweet-time">{formatRelativeTime(post.postedAt)}</span>
          {post.likes > 0 && (
            <span className="tweet-likes">♥ {post.likes.toLocaleString()}</span>
          )}
        </div>
      </div>

      <p className="tweet-text">{post.text}</p>

      {post.imageUrls.length > 0 && (
        <div className="tweet-images">
          {post.imageUrls.map((url, i) => (
            <img key={i} src={url} alt="投稿画像" className="tweet-image" loading="lazy" />
          ))}
        </div>
      )}

      {showLocation && post.locationName && (
        <div className="tweet-location">
          <span className="location-icon">📍</span>
          <span>{post.locationName}</span>
        </div>
      )}

      {post.products && post.products.length > 0 && (
        <div className="tweet-products">
          {post.products.map((p) => (
            <span key={p.id} className="tweet-product-tag">
              🎰 {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
