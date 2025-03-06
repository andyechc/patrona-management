import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

function TableSkeleton({rows = 1, cells = 1}) {
  const rowsArray = new Array(rows);
  const cellsArray = new Array(cells);

  return (
    <>
      {rowsArray.map((row, i) => (
        <TableRow key={i}>
          {cellsArray.map((cell, i) => (
            <TableCell key={i}>
              <Skeleton className="w-full rounded-md h-5" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default TableSkeleton;
