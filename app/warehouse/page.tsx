import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import WarehouseTable from "./warehouse-table";

function WarehousePage() {
  
  return (
    <RootLayout>
      <PageSection title="Almacén">
        <WarehouseTable/>
      </PageSection>
    </RootLayout>
  );
}

export default WarehousePage;
