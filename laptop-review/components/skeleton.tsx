interface SkeletonProps {
    className?: string
    variant?: 'rectangle' | 'circle' | 'text' | 'card'
    height?: string | number
    width?: string | number
  }
  
  export function Skeleton({
    className = '',
    variant = 'rectangle',
    height = 'auto',
    width = '100%',
  }: SkeletonProps) {
    const baseStyles = 'shimmer bg-gray-200'
    
    const getVariantStyles = () => {
      switch (variant) {
        case 'circle':
          return 'rounded-full'
        case 'text':
          return 'h-4 rounded-md'
        case 'card':
          return 'rounded-lg overflow-hidden'
        default:
          return 'rounded-md'
      }
    }
    
    const styles = `${baseStyles} ${getVariantStyles()} ${className}`
  
    return (
      <div 
        className={styles}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      ></div>
    )
  }
  
  export function CardSkeleton() {
    return (
      <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
        <div className="p-4">
          <Skeleton variant="rectangle" height={160} className="mb-4" />
          <Skeleton variant="text" width="70%" className="mb-2" />
          <Skeleton variant="text" width="40%" className="mb-4" />
          <Skeleton variant="text" width="90%" className="mb-2" />
          <Skeleton variant="text" width="90%" className="mb-4" />
          <div className="flex items-baseline gap-2 mb-4">
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={40} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton variant="rectangle" height={36} />
            <Skeleton variant="rectangle" height={36} />
          </div>
        </div>
      </div>
    )
  }
  
  export function ArticleSkeleton() {
    return (
      <div className="overflow-hidden transition-all duration-200 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
        <Skeleton variant="rectangle" height={192} />
        <div className="p-4">
          <Skeleton variant="text" width="30%" className="mb-2" />
          <Skeleton variant="text" width="80%" className="mb-2" />
          <Skeleton variant="text" width="90%" className="mb-2" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
    )
  }