import CashRegister from '@/models/CashRegister';
import { getAll } from '@/utils/api/method-handler';

export async function GET() {
  return await getAll({
    model: CashRegister,
    sort: {name: -1}
  })
}
