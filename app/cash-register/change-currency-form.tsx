import { ExchangeFormSchema } from "@/components/forms/schemas/exchange";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function ChangeCurrencyForm({
  exchange,
  setExchange,
  primaryAmount,
  secondaryAmount,
  cancelClick,
  onSubmit,
}: {
  exchange: number;
  setExchange: Dispatch<SetStateAction<number>>;
  primaryAmount: number;
  secondaryAmount: number;
  cancelClick: React.ReactNode;
  onSubmit: (data: z.infer<typeof ExchangeFormSchema>) => void;
}) {
  const [exchangeValue, setExchangeValue] = useState(exchange);
  const [selectedCurrency, setSelectedCurrency] = useState("CUP");
  const [amountValue, setAmountValue] = useState(
    selectedCurrency === "CUP" ? exchangeValue : 1
  );
  const toCUP = selectedCurrency === "CUP";

  const result = toCUP
    ? primaryAmount - amountValue / exchangeValue
    : secondaryAmount - amountValue * exchangeValue;

  const form = useForm({
    resolver: zodResolver(ExchangeFormSchema),
    defaultValues: {
      to: selectedCurrency,
      exchange: exchangeValue,
      amount: selectedCurrency === "CUP" ? exchangeValue : 1,
    },
  });

  useEffect(() => {
    if (result < 0) {
      form.setError("amount", {
        message: "Esa cantidad no te la puedes permitir",
      });
    } else {
      form.clearErrors("amount");
    }
  }, [result, form]); // Ejecutar cuando cambie 'result' o 'form'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Selecciona la moneda a Cambiar.</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    setSelectedCurrency(value);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                  className="flex items-center gap-5 flex-wrap"
                >
                  <FormItem className="flex items-center rounded border p-3">
                    <FormControl>
                      <RadioGroupItem value="CUP" />
                    </FormControl>
                    <FormLabel className="font-bold text-xl">CUP</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center rounded border p-3">
                    <FormControl>
                      <RadioGroupItem value="USD" />
                    </FormControl>
                    <FormLabel className="font-bold text-xl">USD</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exchange"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Taza de Cambio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(null);
                    } else {
                      const numberValue = Number(value);
                      field.onChange(isNaN(numberValue) ? value : numberValue);
                      setExchangeValue(numberValue);
                      setExchange(numberValue);
                    }
                  }}
                  placeholder="1"
                  min={1}
                  defaultValue={field.value}
                  className="rounded"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3">
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(null);
                    } else {
                      const numberValue = Number(value);
                      setAmountValue(numberValue);
                      field.onChange(isNaN(numberValue) ? value : numberValue);
                    }
                  }}
                  placeholder="1"
                  min={selectedCurrency === "CUP" ? exchangeValue : 1}
                  step={selectedCurrency === "CUP" ? exchangeValue : 1}
                  defaultValue={field.value}
                  className="rounded"
                />
              </FormControl>
              <FormDescription>Cantidad de la moneda deseada</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormDescription>
            Vas a obtener ${amountValue} {selectedCurrency}.{" "}
            {toCUP
              ? `Esto equivale a $${
                  amountValue / exchangeValue
                } USD. Te quedarían $${result} USD en la Caja`
              : `Esto equivale a $${
                  amountValue * exchangeValue
                } CUP. Te quedarían $${result} CUP en la Caja`}
          </FormDescription>
        </FormItem>

        {cancelClick}
        <Button className="rounded cursor-pointer" disabled={result < 0}>
          Aceptar
        </Button>
      </form>
    </Form>
  );
}

export default ChangeCurrencyForm;
