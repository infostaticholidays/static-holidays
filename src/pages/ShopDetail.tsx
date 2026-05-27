import { useParams } from "wouter";
import { useGetProduct } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Package, Truck, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ShopDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);

  const { data: product, isLoading } = useGetProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-8">Product not found</div>;
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to basket",
      description: `${quantity}x ${product.name} has been added to your order.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* BACK BUTTON */}
      <Link
        href="/shop"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="bg-muted rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
          <img
            src={product.imageUrl || "/images/trust-badge.png"}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <div>
            <Badge className="mb-3">{product.category}</Badge>

            <h1 className="text-3xl font-bold mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold mb-4">
              £{product.price}
            </p>

            <p className="text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <span>Quantity</span>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>

              <span className="w-10 text-center">{quantity}</span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            className="w-full h-12 text-base"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Basket
          </Button>

          {/* INFO */}
          <div className="space-y-3 text-sm text-muted-foreground">

            <div className="flex gap-2">
              <Truck className="h-5 w-5" />
              Free UK delivery over £50
            </div>

            <div className="flex gap-2">
              <Package className="h-5 w-5" />
              Eco-friendly packaging
            </div>

            <div className="flex gap-2">
              <ShieldCheck className="h-5 w-5" />
              Secure checkout & returns
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
