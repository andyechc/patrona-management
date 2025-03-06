import RootLayout from "@/components/layout";
import PageSection from "@/components/page-section";
import ProductForm from "./product-form";

export default function ProductAddPage () {
    return (
    <RootLayout>
      <PageSection title="Añade un nuevo producto">
        <ProductForm/>
      </PageSection>
    </RootLayout>
  );
}
