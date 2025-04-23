"use client";
import ErrorMessage from "@/components/error-message";
import Loading from "@/components/loading";
import PageSection from "@/components/page-section";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InventaryTable from "../inventary/inventary-table";
import ProductsTable from "@/app/rooms/products/products-table";
import { Button } from "@/components/ui/button";
import SuccessMessage from "@/components/success-mesage";
import { toast } from "sonner";
import { X } from "lucide-react";

function DetailRoomPage() {
  const { id } = useParams();
  const { data, error, fetchData, handleSubmit, handleDelete, isLoading }: any =
    useCrudOperations("/api/rooms");
  const { data: productList, fetchData: fetchWarehouse }: any =
    useCrudOperations("/api/warehouse");
  const room: Room = data;
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);

  const handleDeleteRoom = () => {
    setIsFinished(false);
    handleDelete(id);
    setIsFinished(true);
  };

  useEffect(() => {
    fetchData(id);
    fetchWarehouse();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [error]);

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
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Eliminados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/rooms")}
        />
      )}

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
            productList={productList}
            handleSubmit={handleSubmit}
            updateDetails={() => {
              fetchData(id);
              fetchWarehouse();
            }}
            products={room.products}
          />
        </div>
      </div>

      <div
        className={
          "sticky bottom-0 left-0 flex mt-8 gap-4 py-2 px-4 bg-background"
        }
      >
        <Button variant={"secondary"} onClick={() => router.replace("/rooms")}>
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
