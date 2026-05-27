import { useGetProduct } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Package, Truck, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ShopDetail() {
  const { id } = useParams();

  const productId = id ? Number(id) : 0;

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId }
  });

  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product) return;

    toast({
      title: "Added to basket",
      description: `${quantity}x ${product.name} added successfully.`,
    });
  };

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-muted-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="bg-muted rounded-2xl p-6 flex items-center justify-center">
          <img
            src={product.imageUrl || "/images/placeholder.png"}
            alt={product.name}
            className="max-h-[400px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-5">

          <div className="flex items-center gap-2">
            <Badge>{product.category}</Badge>
            {product.stock < 10 && (
              <span className="text-sm text-red-500">Low stock</span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl font-bold">£{product.price}</p>

          <p className="text-muted-foreground">{product.description}</p>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <span>Quantity</span>

            <div className="flex border rounded-md">
              <button
                className="px-3"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>

              <div className="px-4">{quantity}</div>

              <button
                className="px-3"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Basket
          </Button>

          {/* INFO */}
          <div className="space-y-3 text-sm text-muted-foreground pt-4">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free UK delivery over £50
            </p>

            <p className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Eco-friendly packaging
            </p>

            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secure checkout & returns
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
