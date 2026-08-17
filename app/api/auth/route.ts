import { NextRequest, NextResponse } from "next/server";

// Credentials live in process.env with fallback defaults for seamless Vercel deployment.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@noveira.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "mudasir";

  let email: unknown;
  let password: unknown;

  try {
    const body = await request.json();
    email = body?.email;
    password = body?.password;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { success: false, error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (email.trim().toLowerCase() !== adminEmail || password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: { email: adminEmail, role: "admin" },
  });
}
