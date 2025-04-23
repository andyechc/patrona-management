import dbConnect from "@/lib/mongodbConnect";
import { NextResponse } from "next/server";
import Factura from "@/models/Factura";
import Client from "@/models/Client";
import { Post } from "@/utils/api/method-handler";

export async function GET() {
  try {
    await dbConnect();
    const data = await Factura.aggregate([
      {
        $lookup: {
          from: Client.collection.collectionName,
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          _id: "$_id",
          clientId: "$clientId",
          name: "$client.name",
          dni: "$client.dni",
          factura: "$factura",
          date: "$date",
          status: "$status",
        },
      },
    ]);

    return NextResponse.json(data.reverse());
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body: Factura = await request.json();

  return await Post({
    body,
    model: Factura,
  });
}
