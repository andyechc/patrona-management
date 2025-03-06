import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import WarehouseForm from "./warehouse-form";

export default function WarehouseAddPage () {
    return (
    <RootLayout>
      <PageSection title="Añade un nuevo ítem de almacén">
        <WarehouseForm/>
      </PageSection>
    </RootLayout>
  );
}
