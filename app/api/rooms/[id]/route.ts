import dbConnect from "@/lib/mongodbConnect";
import Room from "@/models/Room";
import { GetById, Put } from "@/utils/api/method-handler";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return await GetById({
    model: Room,
    id,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: Room = await request.json();

  // const oldRoom = await Room.findOne({ _id: id });

  return await Put({
    body,
    id,
    model: Room,
    allowedUpdates: ["name", "inventary", "products"],
  });
}

// DELETE: Eliminar producto
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const data = await Room.findByIdAndDelete(id);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    let message = "Error al eliminar";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
