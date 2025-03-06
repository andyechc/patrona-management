import Category from "@/models/Category";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  return await GetById({
    model: Category,
    id
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body: Category = await request.json();

  return await Put({
    body,
    id,
    model: Category,
    allowedUpdates: ["name"],
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  return await DeleteById({
    model: Category,
    id,
  });
}
