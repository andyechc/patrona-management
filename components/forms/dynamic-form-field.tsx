"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const DynamicFormField = ({
  control,
  name,
  label,
  type,
  placeholder,
  description,
  step,
  selectData=[],
}: FormFieldConfig & { control: any }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-3">
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
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectData.map((item: {_id:string, name:string}) => (
                      <SelectItem value={item._id} key={item._id}>{item.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Input className="rounded" {...field} placeholder={placeholder} value={field.value ?? ""}/>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
