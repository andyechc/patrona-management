"use client";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const DynamicFormField = ({
  control,
  name,
  label,
  type,
  placeholder,
  description,
  step,
  selectData = [],
  colspan = 1,
}: FormFieldConfig & { control?: any }) => {
  return (
    <FormField
      control={control || undefined}
      name={name}
      render={({ field }) => (
        <FormItem className={`mt-3 col-span-${colspan}`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "number" ? (
              <Input
                type="number"
                className="rounded"
                placeholder={placeholder}
                step={step || 0.01}
                {...field}
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
            ) : type === "select" ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-fit rounded">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectGroup>
                    {selectData.length > 0 &&
                      selectData.map((item: any) => (
                        <SelectItem
                          value={item.productId || item._id}
                          key={item._id}
                          className="rounded"
                        >
                          {item.name}{" "}
                          {item.purchasePrice &&
                            "- Compra: $" +
                              item.purchasePrice +
                              " Moneda: " +
                              item.currency +
                              " Venta: $" +
                              item.salePrice}
                          {item.stock && " Cantidad: " + item.stock}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : type === "textarea" ? (
              <textarea
                className={cn(
                  "border-input placeholder:text-muted-foreground flex h-14 w-full min-w-0 rounded border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm resize-none",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                )}
                placeholder={placeholder}
                {...field}
                value={field.value ?? ""}
              ></textarea>
            ) : (
              <Input
                className="rounded"
                {...field}
                placeholder={placeholder}
                value={field.value ?? ""}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
