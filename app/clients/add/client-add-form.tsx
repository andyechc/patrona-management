"use client";

import ErrorMessage from "@/components/error-message";
import { GenericForm } from "@/components/forms/generic-form";
import {
  inventaryFormConfig,
  InventaryFormSchema,
  productFormConfig,
  ProductsFormSchema,
  roomFormConfig,
  RoomFormSchema,
} from "@/components/forms/schemas/room";
import Loading from "@/components/loading";
import SuccessMessage from "@/components/success-mesage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  clientFormConfig,
  ClientFormSchema,
} from "@/components/forms/schemas/client";
import { MultiSelect } from "@/components/multi-select";

function ClientAddForm() {
  const { error, isLoading, handleSubmit } = useCrudOperations("/api/clients");
  const { data: rooms, fetchData } = useCrudOperations("/api/rooms");
  const [selectedRooms, setSelectedRooms] = useState<string[]>();
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const selectRoomsData =
    rooms.length > 0
      ? rooms.map((room: Room) => ({
          value: room._id,
          label: room.name,
        }))
      : [];

  const onSubmit = (data: z.infer<typeof ClientFormSchema>) => {
    setIsFinished(false);
    handleSubmit({ ...data, rooms: selectedRooms || [] });
    setIsFinished(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <GenericForm
      defaultValues={{}}
      formConfig={clientFormConfig}
      schema={ClientFormSchema}
      onCancelClick={() => router.back()}
      onSubmit={onSubmit}
      gridcols={4}
    >
      <div className={"flex flex-col gap-2"}>
        <p className={"text-sm font-bold"}>Habitaciones</p>
        <MultiSelect
          options={selectRoomsData}
          onValueChange={setSelectedRooms}
          defaultValue={selectedRooms}
          placeholder="Selecciona las Habitaciones"
          variant="inverted"
          animation={2}
          maxCount={3}
        />
        <p className={"text-sm text-white/70"}>Selecciona las habiatciones.</p>
      </div>
      {isLoading && <Loading />}
      {error && <ErrorMessage error={error} />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.back()}
        />
      )}
    </GenericForm>
  );
}

export default ClientAddForm;
