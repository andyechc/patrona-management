import dbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import Room from "@/models/Room";
import Warehouse from "@/models/Warehouse";
import { Post, Put } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await Room.find().populate("products.product").exec();

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

  const { products } = body;

  products.forEach(async (prod: any) => {
    console.log(prod.productId)
    const warehouseReference = warehouses.find(
      (item:any) => item.productId.toString() === prod.productId
    );

    await Put({
      body: { stock: warehouseReference.stock - prod.stock },
      id: warehouseReference._id,
      model: Warehouse,
      allowedUpdates: ["stock"],
    });
  });

  return await Post({
    body,
    model: Room,
  });
}
