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

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "El Nombre debe tener al menos 2 caracteres.",
  }),
});

function CategoriesTable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState({
    name: "",
    _id: "",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: categoryToUpdate.name || "",
    },
  });

  const UpdateData = () => {
    GetAll({
      setData,
      setError,
      setIsLoading,
      url: "/api/categories",
    });
  };

  const handleDelete = async (id: string) => {
    await Delete({
      url: "/api/categories/" + id,
      setError,
      setIsLoading,
    });
    await UpdateData();
  };

  const handleEdit = async (id: string) => {
    const category = data.find((item: Category) => item._id === id);
    if (category) {
      setCategoryToUpdate(category);
      setShowEdit(true);
    }
  };

  async function onSubmitEdit(data: z.infer<typeof FormSchema>) {
    await Put({
      data,
      setError,
      setIsLoading,
      url: "/api/categories/" + categoryToUpdate._id,
    });

    await UpdateData();
    setShowEdit(false);
  }

  const columns: ColumnDef<Category>[] = [
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original;
        return (
          <CellActionButton
            handleDelete={() => handleDelete(category._id)}
            handleEdit={() => handleEdit(category._id)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    UpdateData();
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
        addHref="/categories/add"
      />
      {showEdit && (
        <Dialog open>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Editar Categoría</DialogTitle>
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
                          placeholder="Categoría"
                          {...field}
                          className="rounded"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será el nombre visible de la categoría
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="rounded cursor-pointer bg-red-900 text-red-300 mr-2 hover:bg-red-950"
                  onClick={() => setShowEdit(false)}
                >Cancelar</Button>
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

export default CategoriesTable;
