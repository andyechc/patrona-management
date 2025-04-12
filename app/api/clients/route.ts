import dbConnect from "@/lib/mongodbConnect";
import Client from "@/models/Client";
import { Post } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await Client.find();

    return NextResponse.json(data);
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: Client = await request.json();

  return await Post({
    body,
    model: Client,
  });
}
