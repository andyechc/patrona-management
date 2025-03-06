import dbConnect from "@/lib/mongodbConnect";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function getAll({ model, sort }: GetAllMethod) {
  try {
    await dbConnect();
    const data = await model.find().sort(sort);
    return NextResponse.json(data);
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function Post({ body, model }: PostMethod) {
  try {
    await dbConnect();
    const data = await model.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    let message = "Error al crear los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function GetById({ model, id }: GetByIdMethod) {
  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const data = await model.findById(id);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    let message = "Error al obtener los datos";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function Put({ body, id, model, allowedUpdates }: PutMethod) {
  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }
    
    // Validar campos permitidos
    const updates = Object.keys(body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return NextResponse.json(
        { success: false, message: "Campos no permitidos para actualización" },
        { status: 400 }
      );
    }

    const data = await model.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    let message = "Error al Actualizar";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function DeleteById({ model, id }: DeleteByIdMethod) {
  try {
    await dbConnect();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const data = await model.findByIdAndDelete(id);

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No Encontrado" },
        { status: 404 }
      );
    }

    return new NextResponse(data, { status: 200 });
  } catch (error) {
    let message = "Error al eliminar";
    if (error instanceof Error) {
      message += ": " + error.message;
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
