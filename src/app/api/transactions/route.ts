import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { transactionRepository } from "@/repositories/transaction.repository";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id || session.user.email;
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || undefined;
  const types = searchParams.get("types") ? searchParams.get("types")!.split(",") as any : undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  try {
    const { data, total } = await transactionRepository.findAll(
      userId,
      { search, types },
      undefined,
      page,
      pageSize
    );

    return NextResponse.json({ data, total });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch transactions" }, { status: 500 });
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
    const newTx = await transactionRepository.create(body, userId);
    return NextResponse.json({ data: newTx }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create transaction" }, { status: 500 });
  }
}
