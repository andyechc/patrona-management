import dbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import Room from "@/models/Room";
import Warehouse from "@/models/Warehouse";
import { Post, Put } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";
import { dailyLogOperations } from "@/services/daily-log-operation";

export async function GET() {
  try {
    await dbConnect();
    const data = await Room.find().populate({
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

export async function POST(request: Request) {
  const body: Room = await request.json();
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

  const productsDb = await Product.find();

  const { products } = body;

  for (const prod of products) {
    const warehouseReference = warehouses.find(
      (item: any) => item.productId.toString() === prod.product,
    );

    const prodForLog = productsDb.find(
      (prodDb: any) => prodDb._id.toString() === prod.product,
    );

    await dailyLogOperations({
      title: "Nuevo Producto en " + body.name,
      description: `Se movió ${prod.stock} ${prodForLog.name} a ${body.name}. Quedando en el almacén ${warehouseReference.stock - prod.stock}`,
      type: "info",
    });

    await Put({
      body: { stock: warehouseReference.stock - prod.stock },
      id: warehouseReference._id,
      model: Warehouse,
      allowedUpdates: ["stock"],
    });
  }

  return await Post({
    body,
    model: Room,
  });
}
