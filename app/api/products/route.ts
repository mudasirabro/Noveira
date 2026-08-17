import { products } from "@/src/data/products";

// Read-only catalog endpoint. The seed is static, so this prerenders at build.
export const dynamic = "force-static";

export function GET() {
  return Response.json({ success: true, data: products });
}
