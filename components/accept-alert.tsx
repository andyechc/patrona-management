import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Cross, XCircle } from "lucide-react";

type AcceptAlertProps = {
  onAccept: (event: React.MouseEvent) => void;
  onDecline?: (event: React.MouseEvent) => void;
  title?: string;
  description?: string;
  color?: "green" | "red" | "yellow";
  buttonText?: "Eliminar" | "Confirmar";
};

export default function AcceptAlert({
  onAccept,
  description,
  onDecline,
  title,
  buttonText = "Eliminar",
  color = "red",
}: AcceptAlertProps) {
  return (
    <AlertDialog open>
      <AlertDialogContent className="rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            autoFocus={false}
            onClick={onAccept}
            className={`rounded bg-${color}-800 text-foreground hover:bg-${color}-900`}
          >
            <CheckCircle2 /> {buttonText}
          </AlertDialogAction>
          <AlertDialogAction
            autoFocus={true}
            onClick={onDecline}
            className="rounded bg-foreground text-black hover:bg-foreground/70"
          >
            <XCircle /> Cancelar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
