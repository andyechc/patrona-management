"use client";

import PageSection from "@/components/page-section";
import ClientEditForm from "@/app/clients/[id]/edit/client-edit-form";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/loading";
import { toast } from "sonner";
import { X } from "lucide-react";

function ClientEditPage() {
  const { data, error, isLoading, fetchData }: any =
    useCrudOperations("/api/clients");
  const id = useSearchParams().get("id");

  useEffect(() => {
    if (id) fetchData(id);
    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error, id]);

  if (!data || !data.status) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }

  return (
    <PageSection title="Editar Cliente">
      <ClientEditForm client={data} />
    </PageSection>
  );
}

export default ClientEditPage;
