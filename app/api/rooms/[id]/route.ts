import dbConnect from "@/lib/mongodbConnect";
import Room from "@/models/Room";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import Warehouse from "@/models/Warehouse";
import Product from "@/models/Product";
import { Put } from "@/utils/api/method-handler";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await dbConnect();
    const data = await Room.findById(id).populate({
      path: "products.product",
      model: "Product",
    });

    return NextResponse.json(data);
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body: Room = await request.json();

  const { products } = body;

  if (products) {
    const warehouses = await Warehouse.aggregate([
      {
        $lookup: {
          from: Product.collection.collectionName,
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: "$_id",
          productId: "$productId",
          stock: "$stock",
          name: "$product.name",
          purchasePrice: "$product.purchasePrice",
          salePrice: "$product.salePrice",
          category: "$product.category",
          currency: "$product.currency",
        },
      },
    ]);

    for (const prod of products) {
      const warehouseReference = warehouses.find(
        (item: any) => item.productId.toString() === prod.product,
      );
      {
        if (!warehouseReference) {
          return NextResponse.json(
            { success: false, message: "Producto en Almacén no encontrado" },
            { status: 400 },
          );
        }
      }

      console.log("resta", { stock: warehouseReference.stock - prod.stock });
      await Put({
        body: { stock: warehouseReference.stock - prod.stock },
        id: warehouseReference._id,
        model: Warehouse,
        allowedUpdates: ["stock"],
      });
    }
  }

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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 },
      );
    }

    const data = await Room.findByIdAndDelete(id);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 },
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
