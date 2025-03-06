"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/error-message";
import { GetAll, Post } from "@/utils/data-fetch";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import SuccessMessage from "@/components/success-mesage";
import { useEffect, useState } from "react";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "El Nombre debe tener al menos 2 caracteres.",
  }),
  price: z
    .number()
    .nonnegative("El Precio no puede ser negativo")
    .min(0.01, { message: "El precio minimo es 0.01" }),
  category: z.string().min(2, {
    message: "La Categoría debe tener al menos 2 caracteres.",
  }),
});

function ProductForm() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsFinished(false);

    await Post({
      data,
      setError,
      setIsLoading,
      url: "/api/products",
    });

    setIsFinished(true);
  }

  useEffect(() => {
    GetAll({
      setData: setCategories,
      setError,
      setIsLoading,
      url: "/api/categories",
    });
  }, []);

  return (
    <Form {...form}>
      {error && <ErrorMessage error={error} />}
      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-3">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Producto" {...field} className="rounded" />
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
                      field.onChange(isNaN(numberValue) ? value : numberValue);
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una Categoría." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories &&
                    categories.map((category: Category) => (
                      <SelectItem value={category.name} key={category._id}>
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
        <Button type="submit" className="rounded cursor-pointer">
          Aceptar
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
