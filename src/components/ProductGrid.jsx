import ProductCard from "@/components/ProductCard";
export default function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
      {items.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
