import { DeleteAll, getAll, Post } from "@/utils/api/method-handler";
import { NextRequest } from "next/server";
import Notes from "@/models/Notes";

export async function GET() {
  return await getAll({
    model: Notes,
    sort: { date: -1 },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  body.date = new Date().toLocaleString();

  const data = {
    title: body.title,
    description: body.description,
    date: body.date,
  };

  return await Post({
    model: Notes,
    body: data,
  });
}

export async function DELETE() {
  return await DeleteAll({ model: Notes });
}
