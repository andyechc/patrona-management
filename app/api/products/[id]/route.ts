import Product from "@/models/Product";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";

// GET: Obtener producto por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  return await GetById({
    model: Product,
    id,
  });
}

// PUT: Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body: Product = await request.json();

  return await Put({
    body,
    id,
    model: Product,
    allowedUpdates: ["name", "price", "category"],
  });
}

// DELETE: Eliminar producto
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  return await DeleteById({
    model: Product,
    id,
  });
}
