import Warehouse from '@/models/Warehouse';
import { getAll, Post } from '@/utils/api/method-handler';

export async function GET() {
  return await getAll({
    model: Warehouse,
    sort: {name: -1}
  })
}

export async function POST(request: Request) {
  const body:Warehouse = await request.json()
  const total:number = body.price * body.stock

  body.total = total
  return await Post({
    body,
    model: Warehouse,
  })
}
