"use client";
import PageSection from "@/components/page-section";
import FacturasTable from "@/app/facturas/facturas-table";

export default function FacturaPage() {
  return (
    <PageSection title={"Facturas"}>
      <FacturasTable />
    </PageSection>
  );
}
