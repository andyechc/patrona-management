"use client";
import PageSection from "@/components/page-section";
import ClientsTable from "@/app/clients/clients-table";

export default function ClientPage() {
  return (
    <PageSection title={"Clientes"}>
      <ClientsTable />
    </PageSection>
  );
}
