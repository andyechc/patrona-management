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
  product: z.string(),  
  stock: z.number().min(1, { message: "La cantidad mínima es 1" }),
});

function WarehouseForm() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product: "",
      stock: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsFinished(false);
    const {price, category, name} = JSON.parse(data.product)

    await Post({
      data: {
        price,
        category,
        name,
        stock: data.stock
      },
      setError,
      setIsLoading,
      url: "/api/warehouse",
    });

    setIsFinished(true);
  }

  useEffect(() => {
    GetAll({
      setData: setProducts,
      setError,
      setIsLoading,
      url: "/api/products",
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
          name="product"
          render={({ field }) => (
            <FormItem className="mt-3">
              <FormLabel>Producto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      field.onChange(isNaN(numberValue) ? value : numberValue);
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
        <Button type="submit" className="rounded cursor-pointer">
          Aceptar
        </Button>
      </form>
    </Form>
  );
}

export default WarehouseForm;
