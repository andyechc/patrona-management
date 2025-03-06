import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import CategoriesTable from "./categories-table";

function CategoriesPage() {
  
  return (
    <RootLayout>
      <PageSection title="Categorías">
        <CategoriesTable/>
      </PageSection>
    </RootLayout>
  );
}

export default CategoriesPage;
