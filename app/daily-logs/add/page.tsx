import PageSection from "@/components/page-section";
import DailyLogsAddForm from "./daily-logs-add-form";

function AddLogPage() {
  return ( 
    <PageSection title="Nuevo Registro"> 
      <DailyLogsAddForm />
    </PageSection>
   );
}

export default AddLogPage;