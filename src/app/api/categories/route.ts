import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { categoryRepository } from "@/repositories/category.repository";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    let categories = await categoryRepository.findAll(userId);
    if (categories.length === 0) {
      await categoryRepository.seedDefaultCategories(userId);
      categories = await categoryRepository.findAll(userId);
    }
    return NextResponse.json({ data: categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;

  try {
    const body = await req.json();
    const newCategory = await categoryRepository.create(body, userId);
    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
