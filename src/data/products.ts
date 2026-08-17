// src/data/products.ts
// Single source of truth for the Noveira catalog.
// Covers Women, Men, and Children — no external database.

export interface Product {
  id: number;
  name: string;
  price: string;
  salePrice?: string;
  image: string;
  isSale: boolean;
  category: string;
  gender: 'Women' | 'Men' | 'Children' | 'Unisex';
  rating: number;
  reviews: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
}

export const products: Product[] = [
  // ── Women ──────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Silk Blend Wrap Blouse",
    price: "Rs.12,900.00 PKR",
    salePrice: "Rs.8,900.00 PKR",
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&h=800&fit=crop",
    isSale: true,
    category: "Blouses",
    gender: "Women",
    rating: 4.5,
    reviews: 12,
    description: "A fluid silk-blend wrap blouse with a softly draped neckline and covered buttons.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Onyx"],
    stock: 15,
  },
  {
    id: 2,
    name: "Tailored Wool Trouser",
    price: "Rs.16,400.00 PKR",
    salePrice: "Rs.11,900.00 PKR",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4156?w=600&h=800&fit=crop",
    isSale: true,
    category: "Trousers",
    gender: "Women",
    rating: 4.2,
    reviews: 8,
    description: "High-rise wool trousers with a pressed crease and a clean, elongating line.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Charcoal", "Camel"],
    stock: 8,
  },
  {
    id: 3,
    name: "Chiffon Evening Gown",
    price: "Rs.34,000.00 PKR",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
    isSale: false,
    category: "Evening",
    gender: "Women",
    rating: 4.8,
    reviews: 15,
    description: "A floor-length chiffon gown with a bias-cut skirt and hand-finished hem.",
    sizes: ["S", "M", "L"],
    colors: ["Champagne", "Deep Plum"],
    stock: 20,
  },
  {
    id: 4,
    name: "Cashmere Boat-Neck Knit",
    price: "Rs.19,800.00 PKR",
    salePrice: "Rs.14,300.00 PKR",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
    isSale: true,
    category: "Knitwear",
    gender: "Women",
    rating: 4.0,
    reviews: 6,
    description: "Pure cashmere knit with a wide boat neckline and ribbed cuffs.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Oat", "Slate"],
    stock: 5,
  },
  {
    id: 5,
    name: "Pleated Midi Skirt",
    price: "Rs.14,600.00 PKR",
    salePrice: "Rs.9,800.00 PKR",
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a6?w=600&h=800&fit=crop",
    isSale: true,
    category: "Skirts",
    gender: "Women",
    rating: 4.4,
    reviews: 9,
    description: "Knife-pleated midi skirt in a lightweight satin with a concealed zip.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pearl", "Sage"],
    stock: 10,
  },
  {
    id: 6,
    name: "Structured Crepe Blazer",
    price: "Rs.28,900.00 PKR",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    isSale: false,
    category: "Blazers",
    gender: "Women",
    rating: 4.9,
    reviews: 20,
    description: "A single-breasted crepe blazer with sculpted shoulders and a nipped waist.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Onyx", "Ivory"],
    stock: 25,
  },
  {
    id: 7,
    name: "Quilted Leather Shoulder Bag",
    price: "Rs.31,000.00 PKR",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop",
    isSale: false,
    category: "Accessories",
    gender: "Women",
    rating: 4.3,
    reviews: 7,
    description: "Diamond-quilted calf leather with an antique-gold chain strap.",
    sizes: ["One Size"],
    colors: ["Black", "Cognac"],
    stock: 30,
  },
  {
    id: 8,
    name: "Satin Wrap Dress",
    price: "Rs.22,400.00 PKR",
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=800&fit=crop",
    isSale: false,
    category: "Dresses",
    gender: "Women",
    rating: 4.6,
    reviews: 18,
    description: "Fluid satin wrap dress with a V-neckline and adjustable tie waist.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight", "Blush", "Emerald"],
    stock: 14,
  },
  // ── Men ────────────────────────────────────────────────────────────
  {
    id: 9,
    name: "Merino Wool Rollneck",
    price: "Rs.18,500.00 PKR",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&h=800&fit=crop",
    isSale: false,
    category: "Knitwear",
    gender: "Men",
    rating: 4.7,
    reviews: 14,
    description: "Fine-gauge merino rollneck in a relaxed, modern silhouette.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Camel"],
    stock: 22,
  },
  {
    id: 10,
    name: "Slim-Cut Suit",
    price: "Rs.48,000.00 PKR",
    salePrice: "Rs.36,000.00 PKR",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    isSale: true,
    category: "Suits",
    gender: "Men",
    rating: 4.8,
    reviews: 11,
    description: "A slim two-piece suit in Italian wool blend with a half-canvas construction.",
    sizes: ["48", "50", "52", "54", "56"],
    colors: ["Midnight Navy", "Charcoal"],
    stock: 8,
  },
  {
    id: 11,
    name: "Oxford Button-Down Shirt",
    price: "Rs.9,800.00 PKR",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    isSale: false,
    category: "Shirts",
    gender: "Men",
    rating: 4.4,
    reviews: 22,
    description: "Crisp Oxford cloth shirt with a button-down collar and barrel cuffs.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pale Pink"],
    stock: 40,
  },
  {
    id: 12,
    name: "Tapered Chino Trouser",
    price: "Rs.12,500.00 PKR",
    salePrice: "Rs.8,900.00 PKR",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    isSale: true,
    category: "Trousers",
    gender: "Men",
    rating: 4.3,
    reviews: 16,
    description: "Slim-tapered chino in stretch-cotton with a clean finish.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Stone", "Olive", "Navy"],
    stock: 18,
  },
  {
    id: 13,
    name: "Leather Derby Shoe",
    price: "Rs.26,000.00 PKR",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    isSale: false,
    category: "Footwear",
    gender: "Men",
    rating: 4.6,
    reviews: 8,
    description: "Full-grain calf leather derby on a leather sole with Goodyear welt.",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Tan", "Black"],
    stock: 12,
  },
  {
    id: 14,
    name: "Cashmere V-Neck Sweater",
    price: "Rs.22,000.00 PKR",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&h=800&fit=crop",
    isSale: false,
    category: "Knitwear",
    gender: "Men",
    rating: 4.5,
    reviews: 9,
    description: "Two-ply cashmere V-neck with a classic fit and ribbed trims.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Camel", "Charcoal", "Burgundy"],
    stock: 15,
  },
  // ── Children ───────────────────────────────────────────────────────
  {
    id: 15,
    name: "Mini Linen Playsuit",
    price: "Rs.5,800.00 PKR",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop",
    isSale: false,
    category: "Playsuits",
    gender: "Children",
    rating: 4.8,
    reviews: 13,
    description: "Breathable linen playsuit with snap buttons and adjustable straps.",
    sizes: ["2Y", "3Y", "4Y", "5Y", "6Y"],
    colors: ["Pale Blue", "Sand", "Mint"],
    stock: 20,
  },
  {
    id: 16,
    name: "Kids Merino Cardigan",
    price: "Rs.7,200.00 PKR",
    salePrice: "Rs.5,400.00 PKR",
    image: "https://images.unsplash.com/photo-1543727435-c54df5d0fd1c?w=600&h=800&fit=crop",
    isSale: true,
    category: "Knitwear",
    gender: "Children",
    rating: 4.6,
    reviews: 7,
    description: "Soft merino cardigan with wooden buttons and contrast ribbing.",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["Cream", "Dusty Rose", "Sky"],
    stock: 16,
  },
  {
    id: 17,
    name: "Junior Tailored Trouser",
    price: "Rs.6,500.00 PKR",
    image: "https://images.unsplash.com/photo-1524500812684-f0e8fe5a72d9?w=600&h=800&fit=crop",
    isSale: false,
    category: "Trousers",
    gender: "Children",
    rating: 4.4,
    reviews: 5,
    description: "Neatly tailored twill trousers with an elasticated waist for comfort.",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Navy", "Grey"],
    stock: 12,
  },
  {
    id: 18,
    name: "Girls Tulle Party Dress",
    price: "Rs.9,800.00 PKR",
    salePrice: "Rs.7,200.00 PKR",
    image: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600&h=800&fit=crop",
    isSale: true,
    category: "Dresses",
    gender: "Children",
    rating: 4.9,
    reviews: 19,
    description: "Layered tulle dress with a satin bodice and full skirt for special occasions.",
    sizes: ["3Y", "4Y", "5Y", "6Y", "7Y", "8Y"],
    colors: ["Blush", "Ivory", "Lilac"],
    stock: 9,
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return ["All", ...new Set(products.map((p) => p.category))];
}

export function getGenders(): string[] {
  return ["All", "Women", "Men", "Children"];
}

/** Parses "Rs.12,900.00 PKR" into 12900. Returns 0 when unparseable. */
export function parsePrice(value: string): number {
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** The price a customer actually pays. */
export function effectivePrice(product: Pick<Product, "price" | "salePrice">): number {
  return parsePrice(product.salePrice || product.price);
}

export function formatPrice(amount: number): string {
  return `Rs.${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} PKR`;
}
