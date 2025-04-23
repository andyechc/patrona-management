import dbConnect from "@/lib/mongodbConnect";
import Client from "@/models/Client";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { Put } from "@/utils/api/method-handler";
import Product from "@/models/Product";
import Room from "@/models/Room";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await dbConnect();
    const data = await Client.findById(id);

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
  const data = await request.json();
  const body = { ...data };

  if (body.type === "consumo") {
    const { productId, roomId } = data;
    delete body.productId;
    delete body.roomId;
    delete body.date;

    const currentRoom: Room = await Room.findById(roomId).populate({
      path: "products.product",
      model: "Product",
    });
    const currentRoomProducts = currentRoom.products;
    const filterProducts = currentRoomProducts.filter(
      (prod: any) => prod.product._id.toString() !== productId,
    );
    const productUpdated = currentRoomProducts.find(
      (prod: any) => prod.product._id.toString() === productId,
    );

    const dataQuantity = parseInt(
      data.factura
        .find((fact: any) => fact.date === data.date)
        .description.split(" ")[0],
    );

    const oldStock = productUpdated.stock;
    const newStock = oldStock - dataQuantity;
    productUpdated.stock = newStock;

    if (newStock > 0) {
      filterProducts.push(productUpdated);
    }

    await Put({
      body: { products: filterProducts },
      id: roomId,
      model: Room,
      allowedUpdates: ["products"],
    });
  }

  delete body.type;
  // const sortedFactura = body.factura.sort(
  //   (a: any, b: any) => (a.type > b.type ? 1 : -1),
  //   0,
  // );
  // body.factura = sortedFactura;

  return await Put({
    body,
    id,
    model: Client,
    allowedUpdates: [
      "factura",
      "name",
      "email",
      "phone",
      "rooms",
      "dni",
      "status",
    ],
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

    const data = await Client.findByIdAndDelete(id);

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
