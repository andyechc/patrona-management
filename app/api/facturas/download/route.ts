import { NextResponse } from "next/server";
import createReport from "docx-templates";
import { readFileSync } from "fs";
import path from "path";
import { writeFileSync } from "node:fs";

export async function POST(request: Request) {
  try {
    const data: Factura = await request.json();

    // 1. Cargar plantilla desde el directorio public
    const templatePath = path.join(process.cwd(), "documents", "template.docx");
    const template = readFileSync(templatePath, { encoding: null });

    // 2. Generar el documento
    try {
      const report = await createReport({
        template,
        data: {
          ...data,
          total: data.factura?.reduce((acc, curr) => acc + curr.price, 0),
        },
        cmdDelimiter: ["+++", "+++"],
      });
      // 3. Devolver el archivo generado
      return new NextResponse(report, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      });
    } catch (e: any) {
      return new NextResponse("Error interno", { status: 500 });
    }
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
