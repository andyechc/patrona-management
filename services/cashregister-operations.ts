import CashRegister from "@/models/CashRegister";
import { Put } from "@/utils/api/method-handler";
import { NextResponse } from "next/server";

export async function cashregisterOperations(
  operation: "increment" | "discount",
  amount: number,
  currency: string
) {
  const cashregister = await CashRegister.findOne();
  const balanceToOperate = currency === "USD" ? "primary" : "secondary";
  let amountToOperate = cashregister.balances[balanceToOperate].amount;

  if (operation === "discount") {
    if (cashregister && amountToOperate < amount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No se pudo completar la operacion, no tienes fondos suficientes.",
        },
        { status: 400 }
      );
    }

    amountToOperate = amountToOperate - amount;
  }

  if (operation === "increment") {
    amountToOperate = amountToOperate + amount;
  }

  cashregister.balances[balanceToOperate].amount = amountToOperate;

  const newCashRegister = { balances: cashregister.balances };
  await Put({
    body: newCashRegister,
    allowedUpdates: ["balances"],
    id: cashregister._id,
    model: CashRegister,
  });
}
