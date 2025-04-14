"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import ClientsDetails from "@/app/clients/[id]/client-details";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

function DetailClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const {
    data,
    error,
    fetchData,
    handleSubmit,
    handleDelete,
    isLoading,
    setError,
  }: any = useCrudOperations("/api/clients");
  const client: Client = data;

  const handleDeleteClient = () => {
    handleDelete(id);
    router.replace("/clients");
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

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
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      <div className={"flex flex-col gap-8 mt-4"}>
        <ClientsDetails
          client={client}
          handleSubmit={handleSubmit}
          updateDetails={() => fetchData(id)}
        />
      </div>

      <div
        className={
          "flex items-end justify-end mt-4 gap-4 px-2 py-4 bg-background sticky bottom-0 right-0"
        }
      >
        <Button variant={"secondary"} onClick={() => router.back()}>
          Volver
        </Button>
        <Button variant={"destructive"} onClick={handleDeleteClient}>
          Eliminar
        </Button>
        <Button
          variant={"default"}
          className={"bg-green-800 hover:bg-green-900 text-foreground"}
          onClick={handleDeleteClient}
        >
          <FileWarning /> Facturar
        </Button>
      </div>
    </PageSection>
  );
}

export default DetailClientPage;
