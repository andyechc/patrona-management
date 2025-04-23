"use client";

import PageSection from "@/components/page-section";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowBigLeft,
  CarTaxiFront,
  Check,
  FileText,
  Milk,
  X,
} from "lucide-react";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import InfoItem from "@/components/info-item";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AcceptAlert from "@/components/accept-alert";

function FacturaDetailPage() {
  const { id } = useParams();
  const {
    data: facturas,
    fetchData,
    handleSubmit,
  }: any = useCrudOperations("/api/facturas/");
  const {
    error,
    data: cashRegisters,
    fetchData: fetchCashRegisters,
    handleSubmit: handleSubmitCash,
  } = useCrudOperations("/api/cash-register");
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchData(id.toString());
    }
    fetchCashRegisters();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

  const handlePay = () => {
    const totalAmount = facturas.factura?.reduce(
      (acc: number, curr: any) => acc + curr.price,
      0,
    );
    const cashRegister: CashRegister = cashRegisters[0];
    let cashRegisterAmount = cashRegister.balances.primary.amount;
    cashRegisterAmount = totalAmount + cashRegisterAmount;
    cashRegister.balances.primary.amount = cashRegisterAmount;
    const data = { balances: cashRegister.balances };
    handleSubmitCash(data, cashRegister._id);
    handleSubmit(
      {
        status: "pagado",
        clientId: facturas.clientId,
        factura: facturas.factura,
      },
      id,
    );
    router.replace("/facturas");
  };

  const handleDownloadFile = async () => {
    try {
      const response = await fetch("/api/facturas/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facturas),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura-${facturas.name}-${facturas.date}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <PageSection title={"Detalles de Factura"}>
      <div className={"border border-border rounded"}>
        <ul className={"flex flex-col gap-2 p-2 transition-all"}>
          {facturas?.factura?.length > 0 ? (
            facturas.factura.toReversed().map((fac: any, i: number) => (
              <InfoItem label={"$ " + fac.price} key={i}>
                <div className={"flex justify-between flex-wrap items-center"}>
                  <div>
                    <p>{fac.description}</p>
                    <small className={"text-foreground/70"}>{fac.date}</small>
                  </div>

                  <p className={`text-foreground/70`}>
                    {fac.type === "consumo" ? (
                      <Milk size={18} color={"white"} />
                    ) : (
                      <CarTaxiFront size={18} color={"white"} />
                    )}
                  </p>
                </div>
              </InfoItem>
            ))
          ) : (
            <Loading />
          )}
        </ul>

        <div
          className={"flex justify-between items-center border-t border-border"}
        >
          <p className={"p-3 text-foreground/70 "}>
            Total:{" $"}
            {facturas.factura
              ?.reduce((acc: any, curr: any) => acc + curr.price, 0)
              .toFixed(2)}
          </p>

          <div
            className={
              "flex items-end justify-end gap-4 px-2 py-4 bg-background "
            }
          >
            <Button
              variant={"outline"}
              onClick={() => router.replace("/facturas")}
            >
              <ArrowBigLeft />
              Volver
            </Button>
            <Button
              variant={"secondary"}
              className={"bg-cyan-800 hover:bg-cyan-900"}
              onClick={handleDownloadFile}
            >
              <FileText />
              Imprimir Factura
            </Button>
            {facturas.status === "pagado" ? (
              <p className={"flex justify-center items-center gap-2 p-2"}>
                <Check color={"green"} size={12} /> Cobrado
              </p>
            ) : (
              <Button
                variant={"default"}
                className={"bg-green-800 hover:bg-green-900 text-foreground"}
                onClick={() => setShowAcceptAlert(true)}
                disabled={facturas.status === "pagado"}
              >
                <Check /> Cobrar Factura
              </Button>
            )}
          </div>
        </div>
      </div>

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handlePay();
            setShowAcceptAlert(false);
          }}
          onDecline={() => setShowAcceptAlert(false)}
          description={
            "Seguro que desea cobrar esta factura. Una vez cobrado el dinero del total actual se sumará a la caja."
          }
          title={"Cobrar Factura"}
          color={"green"}
          buttonText={"Confirmar"}
        />
      )}
    </PageSection>
  );
}

export default FacturaDetailPage;
