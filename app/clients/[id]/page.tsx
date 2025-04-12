"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ClientsDetails from "@/app/clients/[id]/client-details";

function DetailClientPage() {
  const { id } = useParams();
  const { data, error, fetchData, handleSubmit, isLoading, setError }: any =
    useCrudOperations("/api/clients");
  const client: Client = data;

  useEffect(() => {
    fetchData(id);
  }, []);

  if (!client) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }

  return (
    <PageSection title={"Detalles de " + client.name}>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      <ClientsDetails
        client={client}
        handleSubmit={handleSubmit}
        updateDetails={() => fetchData(id)}
      />
    </PageSection>
  );
}

export default DetailClientPage;
