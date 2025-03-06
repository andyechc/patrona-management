import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import CategoryForm from "./category-form";

export default function CategoryAddPage () {
    return (
    <RootLayout>
      <PageSection title="Añade una nueva categoría">
        <CategoryForm/>
      </PageSection>
    </RootLayout>
  );
}
