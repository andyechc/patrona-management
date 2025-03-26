import {
  ChangeAmountFormSchema,
  ExchangeFormSchema,
} from "@/components/forms/schemas/exchange";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { ArrowLeftRight, Edit, Eye, EyeClosed, KeyRound } from "lucide-react";
import { z } from "zod";
import ChangeCurrencyForm from "./change-currency-form";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { Button } from "@/components/ui/button";
import ChangeAmountForm from "./change-amount-form";
import PasswordInput from "@/components/forms/password-input";
import { useState } from "react";

function CurrencyInfo({
  primary,
  secondary,
  exchange: defaultExchange,
  id,
  password,
}: CurrencyInfoProps) {
  const { error, handleSubmit, isLoading, setError } =
    useCrudOperations("/api/cash-register");
  const [showChangeCurrecy, setShowChangeCurrency] = useState(false);
  const [showChangeAmout, setShowChangeAmount] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [exchange, setExchange] = useState(defaultExchange)

  function onSubmitAmount(data: z.infer<typeof ChangeAmountFormSchema>) {
    const cashregister = {
      balances: { primary, secondary },
    };

    cashregister.balances.primary.amount = data.primaryAmount;
    cashregister.balances.secondary.amount = data.secondaryAmount;

    if (id) handleSubmit(cashregister, id);
    else handleSubmit(cashregister);
    setIsFinished(true);
  }

  function onSubmitCurrency(data: z.infer<typeof ExchangeFormSchema>) {
    const { to, amount, exchange } = data;
    const cashregister = {
      balances: {
        primary,
        secondary,
      },
      exchangeRate: exchange,
    };

    if (to === "CUP") {
      const totalAmountSecondary = secondary.amount + amount;
      const totalAmountPrimary = primary.amount - amount / exchange;
      cashregister.balances.primary.amount = totalAmountPrimary;
      cashregister.balances.secondary.amount = totalAmountSecondary;
      handleSubmit(cashregister, id);
    } else if (to === "USD") {
      const totalAmountPrimary = primary.amount + amount;
      const totalAmountSecondary = secondary.amount - amount * exchange;
      cashregister.balances.primary.amount = totalAmountPrimary;
      cashregister.balances.secondary.amount = totalAmountSecondary;
      handleSubmit(cashregister, id);
    }

    setIsFinished(true);
  }

  function onSubmitPass(e: any) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const oldpass = formData.get("oldpass")?.toString() || "";
    const newpass = formData.get("newpass")?.toString() || "";

    if (oldpass !== atob(password)) {
      return setError(
        "La contraseña anterior que introdujo no coincide, revísela por favor."
      );
    }

    const data = { password: btoa(newpass) };

    handleSubmit(data, id);
    setIsFinished(true);
  }

  return (
    <div className="flex gap-3 items-center justify-between flex-wrap">
      <div className="flex gap-2">
        <h2 className="text-5xl font-extrabold font-mono">{primary?.amount}</h2>
        <p className="text-accent-foreground/50">{primary?.currency}</p>
      </div>

      <div className="flex gap-2">
        <h2 className="text-5xl font-extrabold font-mono">{secondary?.amount}</h2>
        <p className="text-accent-foreground/50">{secondary?.currency}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {primary.amount !== 0 && (
          <Button
            className="rounded cursor-pointer"
            onClick={() => setShowChangeCurrency(true)}
          >
            <ArrowLeftRight /> Cambio de Moneda
          </Button>
        )}
        <Button
          className="rounded cursor-pointer"
          variant={"outline"}
          onClick={() => setShowChangeAmount(true)}
        >
          <Edit /> Editar Caja
        </Button>
        {id && (
          <Button
            className="rounded cursor-pointer"
            variant={"outline"}
            onClick={() => setShowChangePass(true)}
          >
            <KeyRound /> Cambiar Contraseña
          </Button>
        )}
      </div>

      {showChangeAmout && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Cambio de Fondo</DialogTitle>
            {error && <ErrorMessage error={error} />}
            {isLoading && <Loading />}
            {!error && !isLoading && isFinished && (
              <SuccessMessage
                handleConfirm={() => {
                  setShowChangeAmount(false);
                  setIsFinished(false);
                }}
                text="Cambio en el Fondo exitoso"
                title="Cambio en el Fondo"
              />
            )}

            <ChangeAmountForm
              onSubmit={onSubmitAmount}
              primaryAmount={primary.amount}
              secondaryAmount={secondary.amount}
              cancelClick={() => setShowChangeAmount(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showChangeCurrecy && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Cambio de Moneda</DialogTitle>
            {error && <ErrorMessage error={error} />}
            {isLoading && <Loading />}
            {!error && !isLoading && isFinished && (
              <SuccessMessage
                handleConfirm={() => {
                  setShowChangeCurrency(false);
                  setIsFinished(false);
                }}
                text="Cambio de Moneda Exitoso"
                title="Cambio de Moneda"
              />
            )}

            <ChangeCurrencyForm
              exchange={exchange}
              setExchange={setExchange}
              onSubmit={onSubmitCurrency}
              primaryAmount={primary.amount}
              secondaryAmount={secondary.amount}
              cancelClick={
                <DialogClose
                  onClick={() => setShowChangeCurrency(false)}
                  className="rounded cursor-pointer bg-red-900 px-3 py-2 hover:bg-red-950 text-red-300 mr-2"
                >
                  Cancelar
                </DialogClose>
              }
            />
          </DialogContent>
        </Dialog>
      )}

      {showChangePass && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            {error && <ErrorMessage error={error} />}
            {isLoading && <Loading />}
            {!error && !isLoading && isFinished && (
              <SuccessMessage
                handleConfirm={() => {
                  setShowChangePass(false);
                  setIsFinished(false);
                }}
                text="Cambio de contraseña exitoso"
                title="Cambio de Contraseña"
              />
            )}

            <form
              onSubmit={onSubmitPass}
              className="w-full h-fit flex flex-col gap-3"
            >
              <PasswordInput
                label="Contraseña anterior"
                name="oldpass"
                placeholder="****"
                options={{ maxLength: 4 }}
              />
              <PasswordInput
                label="Nueva contraseña"
                name="newpass"
                placeholder="****"
                options={{ maxLength: 4 }}
              />
              <div className="flex gap-2 items-center mt-5">
                <Button
                  variant={"destructive"}
                  type="button"
                  className="rounded px-5"
                  onClick={() => setShowChangePass(false)}
                >
                  Cerrar
                </Button>
                <Button type="submit" className="rounded cursor-pointer">
                  Aceptar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default CurrencyInfo;
