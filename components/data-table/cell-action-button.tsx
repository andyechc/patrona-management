import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

function CellActionButton({ handleDelete, handleEdit }: CellActionButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border rounded">
        {handleEdit && (
          <DropdownMenuItem
            onClick={handleEdit}
            className="p-3 hover:bg-primary-foreground hover:outline-0 text-foreground flex items-center gap-2 cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="p-3 hover:bg-red-900 hover:outline-0 text-red-300 flex items-center gap-2 cursor-pointer rounded"
          onClick={handleDelete}
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CellActionButton;
