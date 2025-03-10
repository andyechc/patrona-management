import dbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import Warehouse from "@/models/Warehouse";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

// GET: Obtener producto por ID
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return await GetById({
    model: Product,
    id,
  });
}

// PUT: Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: Product = await request.json();

  return await Put({
    body,
    id,
    model: Product,
    allowedUpdates: ["name", "purchasePrice", "salePrice", "category"],
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

    const warehouseItems = await Warehouse.find({ productId: id });
    if (warehouseItems.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No se puede eliminar el producto. Primero elimine sus registros en el almacén." 
        },
        { status: 400 }
      );
    }

    const data = await Product.findByIdAndDelete(id);

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
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
