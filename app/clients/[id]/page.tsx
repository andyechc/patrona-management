"use client";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientsDetails from "@/app/clients/[id]/client-details";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Edit, FileWarning, Trash, X } from "lucide-react";
import { toast } from "sonner";
import AcceptAlert from "@/components/accept-alert";

function DetailClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, error, fetchData, handleSubmit, handleDelete, isLoading }: any =
    useCrudOperations("/api/clients");
  const { handleSubmit: submitFactura, error: errorFactura }: any =
    useCrudOperations("/api/facturas");
  const [showAcceptAlert, setShowAcceptAlert] = useState(false);
  const [showFactAcceptAlert, setShowFactAcceptAlert] = useState(false);

  const client: Client = data;

  const handleDeleteClient = () => {
    setShowAcceptAlert(true);
  };

  const handleFacturar = () => {
    const data = {
      clientId: client._id,
      factura: client.factura,

      date: new Date().toLocaleString(),
      status: "pendiente",
    };
    submitFactura(data);

    if (!errorFactura) {
      const updatedClient = {
        status: "inactivo",
        rooms: [],
        factura: [],
      };
      handleSubmit(updatedClient, client._id);

      if (!error) router.push("/facturas?client=" + client._id);
    }
  };

  useEffect(() => {
    fetchData(id);

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [id, error]);

  if (!client) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }
  return (
    <PageSection title={"Detalles del Cliente "}>
      {isLoading && <Loading />}

      <div className={"flex flex-col gap-8 mt-4"}>
        <ClientsDetails
          client={client}
          handleSubmit={handleSubmit}
          updateDetails={() => fetchData(id)}
        />
      </div>

      <div
        className={
          "flex items-end justify-end mt-4 gap-4 px-2 py-4 bg-background sticky bottom-0 right-0 border-t border-border"
        }
      >
        <Button variant={"outline"} onClick={() => router.replace("/clients")}>
          <ArrowBigLeft />
          Volver
        </Button>
        <Button
          variant={"destructive"}
          onClick={handleDeleteClient}
          disabled={client?.factura?.length > 0}
        >
          <Trash />
          Eliminar Cliente
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => router.push("/clients/" + id + "/edit?id=" + id)}
        >
          <Edit />
          Editar Cliente
        </Button>
        <Button
          variant={"default"}
          className={"bg-green-800 hover:bg-green-900 text-foreground"}
          onClick={() => setShowFactAcceptAlert(true)}
          disabled={client && client.factura?.length === 0}
        >
          <FileWarning /> Facturar
        </Button>
      </div>

      {showAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleDelete(id);
            router.replace("/clients");
            setShowAcceptAlert(false);
          }}
          onDecline={() => setShowAcceptAlert(false)}
          description={"Seguro que desea eliminar este Cliente."}
          title={"Eliminar Cliente"}
        />
      )}

      {showFactAcceptAlert && (
        <AcceptAlert
          onAccept={() => {
            handleFacturar();
            setShowFactAcceptAlert(false);
          }}
          onDecline={() => setShowFactAcceptAlert(false)}
          description={
            "Seguro que desea facturar este Cliente. Datos como las habitaciones en las que se encuentra así como los servicios y consumos serán eliminados."
          }
          title={"Facturar Cliente"}
          color={"green"}
          buttonText={"Confirmar"}
        />
      )}
    </PageSection>
  );
}

export default DetailClientPage;
