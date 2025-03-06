"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ErrorMessage from "@/components/error-message"
import { Post } from "@/utils/data-fetch"
import Loading from "@/components/loading"
import { useRouter } from "next/navigation"
import SuccessMessage from "@/components/success-mesage"
import { useState } from "react"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "El Nombre debe tener al menos 2 caracteres.",
  }),
})

function CategoryForm() {
  const [error, setError] = useState("")
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsFinished(false)

    await Post({
      data,
      setError,
      setIsLoading,
      url:"/api/categories"
    })

    setIsFinished(true)
  }

  return (
    <Form {...form}>
      {error && <ErrorMessage error={error}/>}
      {isLoading && <Loading/>}
      {(!error && !isLoading) && isFinished &&
        <SuccessMessage text="Datos Creados Correctamente" title="Tarea Exitosa!" handleConfirm={()=>router.back()}/>
      }
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-3">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Categoría" {...field} className="rounded"/>
              </FormControl>
              <FormDescription>
                Este será el nombre visible de la categoría
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded cursor-pointer">Aceptar</Button>
      </form>
    </Form>
  )
}

export default CategoryForm