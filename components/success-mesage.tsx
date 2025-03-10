import { MouseEventHandler } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

function SuccessMessage({
  text,
  title,
  handleConfirm,
}: {
  text: string;
  title: string;
  handleConfirm: MouseEventHandler;
}) {
  return (
    <AlertDialog open>
      <AlertDialogContent className="rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleConfirm}
            className="rounded bg-green-900 text-green-300 hover:bg-green-950"
          >
            <CheckCircle2 /> Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SuccessMessage;
