declare type PageSectionProps = {
  children: React.ReactNode;
  title: string;
};

declare type ErrorMessageProps = {
  error: string;
  className?: string;
  onClose?: Dispatch<SetStateAction> | undefined;
};

declare type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchKey: string;
  searchPlaceholder?: string;
  pageSize?: number;
  addHref: string;
  actionComponents?: React.ReactNode;
};

declare type CellActionButtonProps = {
  handleDelete: MouseEventHandler<HTMLDivElement>;
  handleEdit: MouseEventHandler<HTMLDivElement>;
};

declare type GenericFormProps = {
  schema: any;
  defaultValues: any;
  onSubmit: (data: any) => void;
  formConfig: FormFieldConfig[];
  onCancelClick?: MouseEventHandler | undefined;
  selectData?: Array;
  gridcols?: number;
  children?: React.ReactNode;
};

declare type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "password" | "textarea" | "email";
  description?: string;
  placeholder?: string;
  step?: number;
  selectData?: Array;
  colspan?: number;
  required?: boolean;
};

declare type CurrencyInfoProps = {
  primary: { amount: number; currency: string };
  secondary: { amount: number; currency: string };
  exchange: number;
  password: string;
  id: string;
};
