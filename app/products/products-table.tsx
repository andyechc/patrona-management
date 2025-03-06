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
import { FormSchema } from "./add/product-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProductsTable() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState({
    name: "",
    price: 0,
    category: "",
    _id: "",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: productToUpdate.name || "",
      price: productToUpdate.price || 0,
    },
  });

  const UpdateData = () => {
    GetAll({
      setData,
      setError,
      setIsLoading,
      url: "/api/products",
    });
  };

  const handleDelete = async (id: string) => {
    await Delete({
      url: "/api/products/" + id,
      setError,
      setIsLoading,
    });
    await UpdateData();
  };

  const handleEdit = async (id: string) => {
    const product = data.find((item: Product) => item._id === id);
    if (product) {
      setProductToUpdate(product);
      setShowEdit(true);
    }
  };

  async function onSubmitEdit(data: z.infer<typeof FormSchema>) {
    await Put({
      data,
      setError,
      setIsLoading,
      url: "/api/products/" + productToUpdate._id,
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <CellActionButton
            handleDelete={() => handleDelete(product._id)}
            handleEdit={() => handleEdit(product._id)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    UpdateData();
    GetAll({
      setData: setCategories,
      setError,
      setIsLoading,
      url: "/api/categories",
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
        addHref="/products/add"
      />

      {showEdit && (
        <Dialog open>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Editar Producto</DialogTitle>
            <Form {...form}>
              {error && <ErrorMessage error={error} />}
              {isLoading && <Loading />}
              <form
                onSubmit={form.handleSubmit(onSubmitEdit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Producto"
                          {...field}
                          className="rounded"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el nombre visible del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step={0.01}
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
                        Este será el precio del producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una Categoría." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories &&
                            categories.map((category: Category) => (
                              <SelectItem
                                value={category.name}
                                key={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Este será el precio del producto
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

export default ProductsTable;
