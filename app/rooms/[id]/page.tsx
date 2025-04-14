"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import InventaryTable from "../inventary/inventary-table";
import ProductsTable from "@/app/rooms/products/products-table";
import { Button } from "@/components/ui/button";

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
  const room: Room = data;
  const router = useRouter();

  const handleDeleteRoom = () => {
    handleDelete(id);
    router.replace("/rooms");
  };

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

      <div className="w-full flex flex-wrap gap-4">
        <div className="flex flex-col flex-grow">
          <p className="text-xl text-accent-foreground font-thin">Inventario</p>
          <InventaryTable
            inventary={room.inventary}
            id={room._id}
            handleSubmit={handleSubmit}
            updateDetails={() => fetchData(id)}
          />
        </div>

        <div className="flex flex-col flex-grow">
          <p className="text-xl text-accent-foreground font-thin">Productos</p>
          <ProductsTable
            id={room._id}
            handleSubmit={handleSubmit}
            updateDetails={() => fetchData(id)}
            products={room.products}
          />
        </div>
      </div>

      <div
        className={
          "sticky bottom-0 left-0 flex mt-8 gap-4 py-2 px-4 bg-background"
        }
      >
        <Button variant={"secondary"} onClick={() => router.back()}>
          Volver
        </Button>
        <Button variant={"destructive"} onClick={handleDeleteRoom}>
          Eliminar Habitación
        </Button>
      </div>
    </PageSection>
  );
}

export default DetailRoomPage;
