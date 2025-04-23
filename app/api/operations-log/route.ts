import DailyLog from "@/models/DailyLog";
import { cashregisterOperations } from "@/services/cashregister-operations";
import { DeleteAll, getAll, Post } from "@/utils/api/method-handler";
import { NextRequest } from "next/server";

export async function GET() {
  return await getAll({
    model: DailyLog,
    sort: { date: -1 },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  body.date = new Date().toLocaleString();

  console.log(body);

  if (body.amount) {
    const typeOperation = body.type === "losses" ? "discount" : "increment";
    await cashregisterOperations(typeOperation, body.amount, body.currency);
  }

  const data = {
    type: body.type,
    title: body.title,
    description: body.description,
    date: body.date,
  };

  return await Post({
    model: DailyLog,
    body: data,
  });
}

export async function DELETE() {
  return await DeleteAll({ model: DailyLog });
}
