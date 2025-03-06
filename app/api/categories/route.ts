import Category from "@/models/Category";
import { getAll, Post } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

// GET: Obtener todos los items
export async function GET() {
  try {
    return await getAll({
      model: Category,
      sort: { name: 1 },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Error obteniendo los datos: " + e },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo Profuct
export async function POST(request: Request) {
  const body:Category = await request.json()

  return await Post({
    body,
    model: Category,
  });
}
