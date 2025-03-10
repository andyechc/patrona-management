import CashRegister from "@/models/CashRegister";
import { Put } from "@/utils/api/method-handler";

// PUT: Actualizar CashRegistero
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: CashRegister = await request.json();

  return await Put({
    body,
    id,
    model: CashRegister,
    allowedUpdates: ["balances", "exchangeRate"],
  });
}
