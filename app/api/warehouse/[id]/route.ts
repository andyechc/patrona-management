import Warehouse from "@/models/Warehouse";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";

// GET: Obtener producto por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  
  return await GetById({
    model: Warehouse,
    id,
  });
}

// PUT: Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body:Warehouse = await request.json();
  const total = body.price * body.stock
  body.total = total

  return await Put({
    body,
    id,
    model: Warehouse,
    allowedUpdates: ["name", "price", "category", "stock", "total"],
  });
}

// DELETE: Eliminar producto
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  return await DeleteById({
    model: Warehouse,
    id,
  });
}
