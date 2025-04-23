import Product from "@/models/Product";
import Warehouse from "@/models/Warehouse";
import { cashregisterOperations } from "@/services/cashregister-operations";
import { dailyLogOperations } from "@/services/daily-log-operation";
import { DeleteById, GetById, Put } from "@/utils/api/method-handler";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Obtener producto por ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body: Warehouse = await request.json();
  const oldWarehouse = await Warehouse.findById(id);
  const { name, purchasePrice, currency, salePrice } = await Product.findById(
    oldWarehouse.productId,
  );

  const typeOperation =
    oldWarehouse.stock > body.stock ? "increment" : "discount";
  const dif = oldWarehouse.stock - body.stock;
  const amount = (dif < 0 ? dif * -1 : dif) * purchasePrice;

  // Verificar operación en caja
  const cashRegisterResult = await cashregisterOperations(
    typeOperation,
    amount,
    currency,
  );
  if (cashRegisterResult instanceof NextResponse) {
    return cashRegisterResult; // Retorna el error si hay fondos insuficientes
  }

  if (oldWarehouse.stock !== body.stock) {
    await dailyLogOperations({
      title: "Cambio en la Cantidad de un Producto en Almacén",
      description: `Se realizó un cambio en el almacén referente al producto ${name} con precio de venta de $${salePrice}. Ahora su cantidad es ${body.stock}. Esto provocó ${typeOperation === "discount" ? "una pérdida " : "un aumento "} de $${amount} ${currency}`,
      type: typeOperation === "discount" ? "losses" : "gains",
    });
  }

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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const warehouse = await Warehouse.findById(id);
  const { name, purchasePrice, currency, salePrice } = await Product.findById(
    warehouse.productId,
  );

  const rooms: Room[] = await Room.find();
  const roomsFounded = rooms.find((room) => {
    return room.products.some(
      (prod: any) => prod.product.toString() === warehouse.productId.toString(),
    );
  });

  if (roomsFounded) {
    return NextResponse.json(
      {
        success: false,
        message:
          "No se puede eliminar el ítem de almacén. Primero elimine su/s registros en la/s habitación/nes.",
      },
      { status: 400 },
    );
  }

  await dailyLogOperations({
    title: "Se eliminó un Producto en Almacén",
    description: `Se eliminó en el almacén el producto ${name} con precio de venta de $${salePrice}, un Precio de Compra de $${purchasePrice} ${currency}, había una cantidad de ${warehouse.stock}. Esto puede traer consecuencias!`,
    type: "warn",
  });

  return await DeleteById({
    model: Warehouse,
    id,
  });
}
