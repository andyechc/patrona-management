import Product from "@/models/Product";
import Warehouse from "@/models/Warehouse";
import { cashregisterOperations } from "@/services/cashregister-operations";
import { dailyLogOperations } from "@/services/daily-log-operation";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";

// GET: Obtener producto por ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return await GetById({
    model: Warehouse,
    id,
  });
}

// PUT: Actualizar producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: Warehouse = await request.json();
  const oldWarehouse = await Warehouse.findById(id);
  const { name, purchasePrice, currency, salePrice } = await Product.findById(
    oldWarehouse.productId
  );

  const typeOperation =
    oldWarehouse.stock > body.stock ? "increment" : "discount";
  const dif = oldWarehouse.stock - body.stock;
  const amount = (dif < 0 ? dif * -1 : dif) * purchasePrice;

  if (oldWarehouse.stock !== body.stock) {
    await dailyLogOperations({
      title: "Cambio en la Cantidad de un Producto en Almacén",
      description: `Se realizó un cambio en el almacén referente al producto ${name} con precio de venta de $${salePrice}. Ahora su cantidad es ${body.stock}. Esto provocó ${typeOperation === "discount" ? "una pérdida " : "un aumento "} de $${amount} ${currency}`,
      type: typeOperation === "discount" ? "losses" : "gains",
    });
  }

  await cashregisterOperations(typeOperation, amount, currency);

  return await Put({
    body,
    id,
    model: Warehouse,
    allowedUpdates: ["stock"],
  });
}

// DELETE: Eliminar producto
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const warehouse = await Warehouse.findById(id);
  const { name, purchasePrice, currency, salePrice } = await Product.findById(
    warehouse.productId
  );

  await dailyLogOperations({
    title: "Se eliminó un Producto en Almacén",
    description: `Se eliminó en el almacén el producto ${name} con precio de venta de $${salePrice}, un Precio de Compra de $${purchasePrice} ${currency}, había una cantidad de ${warehouse.stock}. Esto puede traer consecuencias!`,
    type: "warn"
  });

  return await DeleteById({
    model: Warehouse,
    id,
  });
}
