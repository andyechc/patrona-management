import { DeleteById, Put } from "@/utils/api/method-handler";
import Factura from "@/models/Factura";
import dbConnect from "@/lib/mongodbConnect";
import { NextResponse } from "next/server";
import Client from "@/models/Client";
import { dailyLogOperations } from "@/services/daily-log-operation";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await dbConnect();
    const data = await Factura.aggregate(
      [
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
      ],
      {},
    );

    const facturaFounded = data.find((fact) => fact._id.toString() === id);

    return NextResponse.json(facturaFounded);
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
  const body = await request.json();

  if (body.clientId) {
    await dbConnect();
    const client: any = await Client.findById(body.clientId);

    if (body.status === "pagado") {
      await dailyLogOperations({
        title: "Factura Cobrada",
        description: `Se cobró la Factura de ${client.name}, generando una ganancia de $${body.factura
          ?.reduce((acc: any, curr: any) => acc + curr.price, 0)
          .toFixed(2)}.`,
        type: "gains",
      });
    }
  }

  delete body.clientId;
  delete body.factura;

  return await Put({
    body,
    id,
    model: Factura,
    allowedUpdates: ["status"],
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  return await DeleteById({
    model: Factura,
    id,
  });
}
