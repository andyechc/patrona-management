import dbConnect from "@/lib/mongodbConnect";
import Product from "@/models/Product";
import Warehouse from "@/models/Warehouse";
import { cashregisterOperations } from "@/services/cashregister-operations";
import { Post } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await Warehouse.aggregate([
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
        },
      },
    ]);

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
  const body: Warehouse = await request.json();

  const { purchasePrice } = await Product.findOne({ _id: body.productId });
  const amountToDiscount = body.stock * purchasePrice;

  cashregisterOperations("discount", amountToDiscount)

  return await Post({
    body,
    model: Warehouse,
  });
}
