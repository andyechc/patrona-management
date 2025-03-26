"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import InventaryTable from "../inventary/inventary-table";

function DetailRoomPage() {
  const { id } = useParams();
  const {
    data,
    error,
    fetchData,
    handleSubmit,
    handleDelete,
    isLoading,
    setError,
  }: any = useCrudOperations("/api/rooms");
  const room: Room = data.data;

  useEffect(() => {
    fetchData(id);
  }, []);

  if (!room) {
    return (
      <PageSection title="">
        <Loading />
      </PageSection>
    );
  }

  return (
    <PageSection title={"Detalles de " + room.name}>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      <div className="flex items-center flex-wrap gap-4">
        <div className="flex flex-col flex-grow">
          <p className="text-xl text-accent-foreground font-thin">Inventario</p>
          <InventaryTable inventary={room.inventary} id={room._id}/>
        </div>
        <div className="flex flex-col flex-grow">
        <p className="text-xl text-accent-foreground font-thin">Productos</p>
        </div>
      </div>
    </PageSection>
  );
}

export default DetailRoomPage;
