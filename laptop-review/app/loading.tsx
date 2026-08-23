import { Skeleton, CardSkeleton, ArticleSkeleton } from "@/components/skeleton";
import Footer from "@/components/common/footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container h-16 px-4 mx-auto">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-8">
              <Skeleton variant="rectangle" width={140} height={32} />
            </div>
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <Skeleton variant="rectangle" height={40} />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton variant="rectangle" width={100} height={32} />
              <Skeleton variant="rectangle" width={80} height={32} />
              <Skeleton variant="circle" width={32} height={32} />
              <Skeleton variant="rectangle" width={120} height={36} />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto">
        {/* Featured Section Skeleton */}
        <section className="mb-12">
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
            <Skeleton variant="rectangle" height="100%" />
          </div>
        </section>

        {/* Recommended Section Skeleton */}
        <section className="mb-12">
          <Skeleton variant="text" width={200} className="mb-6" />
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3">
                <Skeleton variant="rectangle" height={190} className="rounded-lg" />
              </div>
              <div className="md:w-2/3">
                <Skeleton variant="text" className="mb-4" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="overflow-hidden bg-gray-50 border rounded-lg">
                      <Skeleton variant="rectangle" height={128} />
                      <div className="p-3">
                        <Skeleton variant="text" className="mb-2" />
                        <Skeleton variant="text" width={60} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Results Skeleton */}
        <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="p-4 bg-white border rounded-lg shadow-sm">
              <Skeleton variant="text" width={120} className="mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-4 pb-2 border-b">
                  <Skeleton variant="text" width={80} className="mb-2" />
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center">
                        <Skeleton variant="rectangle" width={16} height={16} className="rounded mr-2" />
                        <Skeleton variant="text" width={100} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Skeleton variant="rectangle" height={40} className="w-full" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <Skeleton variant="text" width={200} height={36} className="mb-5 sm:mb-0" />
              <div className="flex flex-wrap gap-4">
                <Skeleton variant="rectangle" width={100} height={46} className="rounded-md" />
                <Skeleton variant="rectangle" width={100} height={46} className="rounded-md" />
                <Skeleton variant="rectangle" width={100} height={46} className="rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
            
            <div className="flex justify-center mt-10 mb-6">
              <Skeleton variant="rectangle" width={160} height={48} className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Article Highlights Skeleton */}
        <section className="mb-12">
          <Skeleton variant="text" width={180} className="mb-6" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        </section>
        <div className="flex justify-center mt-10 mb-6">
          <Skeleton variant="rectangle" width={180} height={48} className="rounded-lg" />
        </div>
      </main>

      <Footer />
    </div>
  );
}