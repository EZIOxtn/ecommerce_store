export default function ProductSkeletonCard() {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[180px] md:max-w-[240px] flex flex-col">
        <div className="aspect-[4/3] bg-gray-200" />
        <div className="p-3 flex flex-col gap-2 flex-grow">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-400 rounded w-1/2 mt-auto" />
        </div>
        <div className="p-3 pt-0">
          <div className="h-8 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }
  