'use client';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'avatar' | 'table';
  count?: number;
  className?: string;
}

export function SkeletonLoader({ type = 'text', count = 1, className = '' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'title':
        return <div className="skeleton skeleton-title"></div>;
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
          </div>
        );
      case 'avatar':
        return <div className="skeleton skeleton-avatar"></div>;
      case 'table':
        return (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  {[1, 2, 3, 4].map((i) => (
                    <th key={i}>
                      <div className="skeleton skeleton-text" style={{ height: '1rem' }}></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {[1, 2, 3, 4].map((col) => (
                      <td key={col}>
                        <div className="skeleton skeleton-text"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <div className="skeleton skeleton-text"></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}

