declare type PageSectionProps = {
  children: React.ReactNode;
  title: string;
};

declare type ErrorMessageProps = {
  error: string;
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