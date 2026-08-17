// src/data/products.ts
// Single source of truth for the Noveira catalog.
// Covers Women, Men, and Children.

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
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1548624313-0396a93cc90f?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop",
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

const STOCK_STORAGE_KEY = 'noveira_stock_overrides';

export function syncStockFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STOCK_STORAGE_KEY);
    if (!stored) return;
    const map = JSON.parse(stored) as Record<number, number>;
    for (const idStr of Object.keys(map)) {
      const id = Number(idStr);
      const prod = products.find((p) => p.id === id);
      if (prod && typeof map[id] === 'number') {
        prod.stock = Math.max(0, map[id]);
      }
    }
  } catch {
    // ignore
  }
}

export function updateStock(id: number, newStock: number): Product | undefined {
  const p = products.find((prod) => prod.id === id);
  if (p) {
    p.stock = Math.max(0, newStock);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STOCK_STORAGE_KEY);
        const map = stored ? JSON.parse(stored) : {};
        map[id] = p.stock;
        localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // ignore
      }
    }
  }
  return p;
}

export function addLocalProduct(prodData: Omit<Product, 'id'>): Product {
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct: Product = { id: newId, ...prodData };
  products.unshift(newProduct);
  return newProduct;
}

export function updateLocalProduct(id: number, prodData: Partial<Product>): Product | undefined {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...prodData };
    return products[index];
  }
  return undefined;
}

export function deleteLocalProduct(id: number): boolean {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
}

export function getProductById(id: number): Product | undefined {
  syncStockFromStorage();
  return products.find((p) => p.id === id);
}

export function getCategories(): string[] {
  return ["All", ...new Set(products.map((p) => p.category))];
}

export function getGenders(): string[] {
  return ["All", "Women", "Men", "Children"];
}

/** Parses "Rs.12,900.00 PKR" or "PKR 14,300" into numeric 14300. Returns 0 when unparseable. */
export function parsePrice(value: string | number | undefined | null): number {
  if (typeof value === 'number') return Number.isNaN(value) ? 0 : value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/Rs\.?/gi, "")
    .replace(/PKR/gi, "")
    .replace(/,/g, "")
    .trim();

  const match = cleaned.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return 0;

  const parsed = Number.parseFloat(match[1]);
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
