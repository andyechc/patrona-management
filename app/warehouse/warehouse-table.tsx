"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Delete, GetAll, Put } from "@/utils/data-fetch";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "./add/warehouse-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function WarehouseTable() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [warehouseToUpdate, setWarehouseToUpdate] = useState({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    total: 0,
    _id: "",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product: "",
      stock: 0,
    },
  });

  const UpdateData = () => {
    GetAll({
      setData,
      setError,
      setIsLoading,
      url: "/api/warehouse",
    });
  };

  const handleDelete = async (id: string) => {
    await Delete({
      url: "/api/warehouse/" + id,
      setError,
      setIsLoading,
    });
    await UpdateData();
  };

  const handleEdit = async (id: string) => {
    const warehouse = data.find((item: Product) => item._id === id);

    if (warehouse) {
      setWarehouseToUpdate(warehouse);
      setShowEdit(true);
    }
  };

  async function onSubmitEdit(data: z.infer<typeof FormSchema>) {
    const { price, category, name } = JSON.parse(data.product);

    await Put({
      data: {
        price,
        category,
        name,
        stock: data.stock,
      },
      setError,
      setIsLoading,
      url: "/api/warehouse/" + warehouseToUpdate._id,
    });

    await UpdateData();
    setShowEdit(false);
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombres
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Precio
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>${row.getValue("price")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cantidad
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const warehouse = row.original;
        return (
          <CellActionButton
            handleDelete={() => handleDelete(warehouse._id)}
            handleEdit={() => handleEdit(warehouse._id)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    UpdateData();
    GetAll({
      setData: setProducts,
      setError,
      setIsLoading,
      url: "/api/products",
    });
  }, []);

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={data}
        error={error}
        isLoading={isLoading}
        addHref="/warehouse/add"
      />

      {showEdit && (
        <Dialog open>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Item de Almacén</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Editar Ítem de Almacén</DialogTitle>
            <Form {...form}>
              {error && <ErrorMessage error={error} />}
              {isLoading && <Loading />}
              <form
                onSubmit={form.handleSubmit(onSubmitEdit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Producto</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un Producto." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products &&
                            products.map((product: Product) => (
                              <SelectItem
                                value={JSON.stringify(product)}
                                key={product._id}
                              >
                                {product.name} - ${product.price}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Este será el producto.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          {...field}
                          className="rounded"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              field.onChange(null);
                            } else {
                              const numberValue = Number(value);
                              field.onChange(
                                isNaN(numberValue) ? value : numberValue
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Este será la cantidad de este producto en el almacén
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="rounded cursor-pointer bg-red-900 text-red-300 mr-2 hover:bg-red-950"
                  onClick={() => setShowEdit(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="rounded cursor-pointer">
                  Aceptar
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default WarehouseTable;
