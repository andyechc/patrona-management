import dbConnect from "@/lib/mongodbConnect";
import DailyLog from "@/models/DailyLog";
import parseDate from "@/utils/parse-date";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const logs = await DailyLog.find().sort({ date: -1 });
    const txtContent = logs
      .map(
        (log) =>
          `Tipo: ${
            (log.type === "gains" && "Ganancia") ||
            (log.type === "losses" && "Pérdida") ||
            (log.type === "warn" && "Advertencia") ||
            "Informativo"
          }\nFecha: ${log.date}\nTítulo: ${
            log.title
          }\nDescripción: ${log.description}\n\n`,
      )
      .join("");

    return new NextResponse(txtContent, {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Disposition": 'attachment; filename="registros.txt"',
      },
    });
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
