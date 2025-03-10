declare type PageSectionProps = {
  children: React.ReactNode;
  title: string;
};

declare type ErrorMessageProps = {
  error: string;
  className?: string,
  setError?: Dispatch<SetStateAction>
};

declare type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchKey: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  addHref: string
};

declare type CellActionButtonProps = {
  handleDelete: MouseEventHandler<HTMLDivElement>;
  handleEdit: MouseEventHandler<HTMLDivElement>;
}

declare type GenericFormProps = {
  schema: any;
  defaultValues: any;
  onSubmit: (data: any) => void;
  formConfig: FormFieldConfig[];
  onCancelClick: MouseEventHandler;
  selectData?: Array;
  children?: React.ReactNode;
}

declare type FormFieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  description?: string;
  placeholder?: string;
  step?: number;
  selectData?: Array;
};