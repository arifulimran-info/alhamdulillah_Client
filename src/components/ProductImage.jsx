import { categoryByName } from "@/lib/utils";

// Shows the uploaded image, or a tinted category tile when a product has no photo yet.
export default function ProductImage({ product, className = "" }) {
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  const c = categoryByName(product.category);
  return (
    <div
      className={`w-full h-full grid place-items-center text-5xl ${className}`}
      style={{
        background: `linear-gradient(135deg, ${c.tint}55, ${c.tint}bb)`,
      }}
      aria-label={product.name}>
      <span>{c.emoji}</span>
    </div>
  );
}
