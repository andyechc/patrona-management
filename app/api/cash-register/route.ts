import CashRegister from '@/models/CashRegister';
import { getAll, Post } from '@/utils/api/method-handler';
import { NextRequest } from 'next/server';

export async function GET() {
  return await getAll({
    model: CashRegister,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (!body.password) body.password = btoa("000000")

  return await Post({
    model: CashRegister,
    body
  })
}