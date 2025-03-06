import Product from '@/models/Product';
import { getAll, Post } from '@/utils/api/method-handler';

export async function GET() {
  return await getAll({
    model: Product,
    sort: {name: -1}
  })
}

export async function POST(request: Request) {
  const body:Product = await request.json()

  return await Post({
    body,
    model: Product,
  })
}
