import Room from '@/models/Room';
import { getAll, Post } from '@/utils/api/method-handler';

export async function GET() {
  return await getAll({
    model: Room,
    sort: {name: -1}
  })
}

export async function POST(request: Request) {
  const body:Room = await request.json()

  return await Post({
    body,
    model: Room,
  })
}
