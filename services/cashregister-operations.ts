import CashRegister from "@/models/CashRegister";
import { Put } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

export async function cashregisterOperations(
  operation: "increment" | "discount",
  amount: number
) {
  const cashregister = await CashRegister.findOne();
  let primaryAmount = cashregister.balances.primary.amount;

  if (operation === "discount") {
    if (cashregister && cashregister.balances.primary.amount < amount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se pudo completar la operacion, no tienes fondos suficientes.",
        },
        { status: 400 }
      );
    }
    primaryAmount = primaryAmount - amount;
    cashregister.balances.primary.amount = primaryAmount;
  }

  if (operation === "increment") {
    primaryAmount = primaryAmount + amount;
    cashregister.balances.primary.amount = primaryAmount;
  }

  const newCashRegister = { balances: cashregister.balances };
  await Put({
    body: newCashRegister,
    allowedUpdates: ["balances"],
    id: cashregister._id,
    model: CashRegister,
  });
}
