import dbConnect from "@/lib/mongodbConnect";
import parseDate from "@/utils/parse-date";
import { NextResponse } from "next/server";
import Notes from "@/models/Notes";

export async function GET() {
  try {
    await dbConnect();
    const notes = await Notes.find().sort({ date: -1 });
    const txtContent = notes
      .map(
        (n) => `
        \nFecha: ${n.date}\nTítulo: ${
          n.title
        }\nDescripción: ${n.description}\n\n`,
      )
      .join("");

    return new NextResponse(txtContent, {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Disposition": 'attachment; filename="Observaciones.txt"',
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
