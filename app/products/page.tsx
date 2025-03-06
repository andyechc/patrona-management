import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import ProductsTable from "./products-table";

function ProductsPage() {
  
  return (
    <RootLayout>
      <PageSection title="Productos">
        <ProductsTable/>
      </PageSection>
    </RootLayout>
  );
}

export default ProductsPage;
