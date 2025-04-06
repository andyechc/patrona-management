Para lograr lo que necesitas en **Next.js + MongoDB con Mongoose**, hay que usar el método `.populate()` de Mongoose, que te permite reemplazar los IDs de referencia por los documentos completos a los que hacen referencia.

### Paso a paso:

#### 1. Modelo de Producto (Almacén)
```js
// models/Producto.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  // otros campos...
});

export default mongoose.models.Producto || mongoose.model('Producto', productoSchema);
```

#### 2. Modelo de Habitación
```js
// models/Habitacion.js
import mongoose from 'mongoose';

const habitacionSchema = new mongoose.Schema({
  nombre: String,
  stock: Number,
  inventario: [
    {
      item: String,
      cantidad: Number,
    }
  ],
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
      },
      stock: Number
    }
  ]
});

export default mongoose.models.Habitacion || mongoose.model('Habitacion', habitacionSchema);
```

Fíjate que el campo `productos` es un array de objetos que contienen una referencia (`producto`) al modelo `Producto` y un `stock`.

---

#### 3. Lógica para obtener habitaciones con productos **populados**

```js
import dbConnect from '@/lib/dbConnect'; // tu función de conexión
import Habitacion from '@/models/Habitacion';

export async function obtenerHabitaciones() {
  await dbConnect();

  const habitaciones = await Habitacion.find()
    .populate('productos.producto') // importante
    .exec();

  return habitaciones;
}
```

Esto reemplazará el ID de cada producto en el array `productos` con el documento completo del producto desde el modelo `Producto`.

---

### Ejemplo de respuesta (lo que obtendrás):

```json
[
  {
    "nombre": "Habitación 1",
    "stock": 10,
    "inventario": [ ... ],
    "productos": [
      {
        "producto": {
          "_id": "6612...",
          "nombre": "Jabón",
          "descripcion": "Jabón líquido",
          "precio": 1.50
        },
        "stock": 5
      },
      ...
    ]
  }
]
```

---

¿Quieres también filtrar o mapear los productos según algún criterio (por ejemplo, solo mostrar nombre y stock), o necesitas una API route completa para esto?