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
import { Plus, Trash2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  clientFormConfig,
  ClientFormSchema,
} from "@/components/forms/schemas/client";
import { MultiSelect } from "@/components/multi-select";
import { toast } from "sonner";

function ClientEditForm({ client }: { client: Client }) {
  const { error, isLoading, handleSubmit }: any =
    useCrudOperations("/api/clients");
  const { data: rooms, fetchData: fetchRooms } =
    useCrudOperations("/api/rooms");
  const [selectedRooms, setSelectedRooms] = useState<string[]>();
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();
  const id = useSearchParams().get("id");

  const selectRoomsData =
    rooms.length > 0
      ? rooms.map((room: Room) => ({
          value: room._id,
          label: room.name,
        }))
      : [];

  const onSubmit = (data: z.infer<typeof ClientFormSchema>) => {
    setIsFinished(false);
    const factura = {
      ...data,
      status:
        selectedRooms && selectedRooms?.length > 0 ? "activo" : data.status,
      rooms: selectedRooms || [],
    };

    if (id) {
      handleSubmit({ ...factura }, id);
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (client) {
      setSelectedRooms(client.rooms);
    }
    fetchRooms();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, [client, error]);

  return (
    <GenericForm
      defaultValues={{ ...client }}
      formConfig={clientFormConfig}
      schema={ClientFormSchema}
      onCancelClick={() => router.replace("/clients/" + id)}
      onSubmit={onSubmit}
      gridcols={4}
    >
      <div className={"flex flex-col gap-2"}>
        <p className={"text-sm font-bold"}>Habitaciones</p>
        <MultiSelect
          options={selectRoomsData}
          onValueChange={setSelectedRooms}
          defaultValue={client.rooms}
          placeholder="Selecciona las Habitaciones"
          variant="inverted"
          animation={2}
          maxCount={2}
        />
        <p className={"text-sm text-white/70"}>Selecciona las habiatciones.</p>
      </div>

      {isLoading && <Loading />}
      {!error && !isLoading && isFinished && (
        <SuccessMessage
          text="Datos Creados Correctamente"
          title="Tarea Exitosa!"
          handleConfirm={() => router.replace("/clients/" + id)}
        />
      )}
    </GenericForm>
  );
}

export default ClientEditForm;
