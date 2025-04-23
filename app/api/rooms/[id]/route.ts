import dbConnect from "@/lib/mongodbConnect";
import Room from "@/models/Room";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import Warehouse from "@/models/Warehouse";
import Product from "@/models/Product";
import { Put } from "@/utils/api/method-handler";
import Client from "@/models/Client";
import { dailyLogOperations } from "@/services/daily-log-operation";

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
  const data = await request.json();
  const body = { ...data };
  const { productEditedId, inventaryEditedId } = data;

  await dbConnect();

  console.log(inventaryEditedId);

  if (inventaryEditedId) {
    delete body.inventaryEditedId;
    return await Put({
      body,
      id,
      model: Room,
      allowedUpdates: ["name", "inventary", "products"],
    });
  }

  const warehouses: Warehouse[] = await Warehouse.aggregate([
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

  const warehouseReference = warehouses.find(
    (item) => item.productId.toString() === productEditedId,
  );

  if (!warehouseReference) {
    return NextResponse.json(
      { success: false, message: "Producto en Almacén no encontrado" },
      { status: 400 },
    );
  }

  const product: any = await Product.findById(productEditedId);

  const prevRoom = await Room.findById(id).populate({
    path: "products.product",
    model: "Product",
  });

  const prevProduct = prevRoom?.products.find(
    (prod: any) => prod.product._id.toString() === productEditedId,
  );

  const newStock = body.products.find((prod: any) => {
    if (typeof prod.product === "string") {
      return prod.product === productEditedId;
    }
    return prod.product._id === productEditedId;
  }).stock;

  if (!prevProduct) {
    await dailyLogOperations({
      title: "Nuevo Producto en " + prevRoom.name,
      description: `Se movió ${newStock} ${product.name} a ${prevRoom.name}. Quedando en el almacén ${warehouseReference.stock - newStock}`,
      type: "info",
    });

    await Put({
      body: {
        stock: warehouseReference.stock - newStock,
      },
      id: warehouseReference._id,
      model: Warehouse,
      allowedUpdates: ["stock"],
    });
  }

  if (prevProduct && newStock > 0) {
    await dailyLogOperations({
      title: "Producto Editado en " + prevRoom.name,
      description: `Se editó el producto ${product.name} en ${prevRoom.name}. Ahora su cantidad es de ${newStock}, Quedando en el almacén ${warehouseReference.stock + (prevProduct.stock - newStock)}`,
      type: "info",
    });

    await Put({
      body: {
        stock: warehouseReference.stock + (prevProduct.stock - newStock),
      },
      id: warehouseReference._id,
      model: Warehouse,
      allowedUpdates: ["stock"],
    });
  }

  if (newStock === 0) {
    await dailyLogOperations({
      title: "Producto Eliminado de " + prevRoom.name,
      description: `Se eliminó el producto ${prevProduct.product.name} en ${prevRoom.name}. Quedando en el almacén ${warehouseReference.stock + prevProduct.stock}`,
      type: "info",
    });

    await Put({
      body: {
        stock: warehouseReference.stock + prevProduct.stock,
      },
      id: warehouseReference._id,
      model: Warehouse,
      allowedUpdates: ["stock"],
    });
  }

  body.products = data.products.filter((prod: any) => prod.stock > 0);

  delete body.productEditedId;
  delete body.type;

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

    const room: Room | null = await Room.findById(id);
    const clients: Client[] = await Client.find();

    if (!room) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 },
      );
    }

    const clientFounded = clients.find((client) => {
      return client.rooms.map((clientRoom) => clientRoom === room._id);
    });

    if (clientFounded) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se puede eliminar esta habitación. El cliente " +
            clientFounded.name +
            " la está ocupando.",
        },
        { status: 400 },
      );
    }

    const data = await Room.findByIdAndDelete(id);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    let message = "Error al eliminar";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
