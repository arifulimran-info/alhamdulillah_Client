export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-box border border-base-300 p-3">
        <div className="skeleton aspect-[4/3] w-full" />
        <div className="skeleton mt-3 h-4 w-3/4" />
        <div className="skeleton mt-2 h-4 w-1/3" />
        <div className="skeleton mt-4 h-9 w-full" />
      </div>
    ))}
  </div>
);
export const PageSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-4 p-6">
    <div className="skeleton h-8 w-1/3" />
    <div className="skeleton h-40 w-full" />
    <div className="skeleton h-40 w-full" />
  </div>
);
