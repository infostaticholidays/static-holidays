import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// SAFE MOCK DATA (so your site works on Vercel)
const products = [
  {
    id: 1,
    name: "Holiday Candle",
    price: 12.99,
    category: "Gifts",
    imageUrl: "/images/trust-badge.png",
    featured: true,
  },
  {
    id: 2,
    name: "British Tea Set",
    price: 24.99,
    category: "Accessories",
    imageUrl: "/images/trust-badge.png",
    featured: false,
  },
  {
    id: 3,
    name: "Coastal Hoodie",
    price: 39.99,
    category: "Clothing",
    imageUrl: "/images/trust-badge.png",
    featured: true,
  },
];

export default function Shop() {
  const [category, setCategory] = useState("");

  const categories = ["Gifts", "Experiences", "Accessories", "Clothing"];

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">The Static Holidays Shop</h1>
        <p className="text-muted-foreground mt-2">
          Holiday-inspired British products
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          onClick={() => setCategory("")}
          variant={!category ? "default" : "outline"}
        >
          All
        </Button>

        {categories.map((c) => (
          <Button
            key={c}
            onClick={() => setCategory(c)}
            variant={category === c ? "default" : "outline"}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/shop/${product.id}`}>
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-4 text-center">

                <img
                  src={product.imageUrl}
                  className="h-40 mx-auto object-contain"
                />

                <p className="text-xs mt-2 text-muted-foreground uppercase">
                  {product.category}
                </p>

                <h3 className="font-bold mt-1">{product.name}</h3>

                <p className="font-bold mt-2">£{product.price}</p>

                {product.featured && (
                  <Badge className="mt-2">Featured</Badge>
                )}

                <ShoppingBag className="h-5 w-5 mx-auto mt-3 text-primary" />

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
