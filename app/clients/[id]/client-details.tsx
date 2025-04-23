"use client";
import { Button } from "@/components/ui/button";
import { FormEventHandler, ReactNode, useEffect, useState } from "react";
import { useCrudOperations } from "@/hooks/useCrudOperation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GenericForm } from "@/components/forms/generic-form";
import {
  clientFormServicesConfig,
  ClientFormServicesSchema,
} from "@/components/forms/schemas/client";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CarTaxiFront, Milk, X } from "lucide-react";
import InfoItem from "@/components/info-item";
import { toast } from "sonner";

function ClientsDetails({
  client,
  handleSubmit,
  updateDetails,
}: {
  client: Client;
  handleSubmit: (value: any, id?: string) => void;
  updateDetails: () => void;
}) {
  const [showAddServices, setShowAddServices] = useState(false);
  const [showAddConsumes, setShowAddConsumes] = useState(false);
  const [productsToSelect, setProductsToSelect] = useState([]);
  const [roomSelected, setRoomSelected] = useState("");
  const [productSelected, setProductSelected] = useState("");
  const [quantity, setQuantity] = useState(0);
  const { data: rooms, fetchData, error } = useCrudOperations("/api/rooms");

  const clientRooms =
    (rooms.length > 0 &&
      client &&
      client?.rooms?.map((clientRoom) =>
        rooms.find((room: Room) => room._id === clientRoom),
      )) ||
    [];

  useEffect(() => {
    fetchData();

    if (error) {
      toast(error, { icon: <X color={"red"} size={16} /> });
    }
  }, []);

  const onSubmitServices = (data: z.infer<typeof ClientFormServicesSchema>) => {
    const date = new Date().toLocaleString();
    const service = { ...data, type: "servicio", date };
    const newFactura = [...client.factura];
    newFactura.push(service);
    handleSubmit({ factura: newFactura, type: service.type }, client._id);
    updateDetails();
    setShowAddServices(false);
  };

  const selectRoomChangeHandler = (room: string): void => {
    setRoomSelected(room);

    const roomChose: any = clientRooms.find((clientRoom: any) => {
      return clientRoom._id === JSON.parse(room).id;
    });

    const productsFind = roomChose.products;

    setProductsToSelect(productsFind || []);
  };

  const onSubmitConsumes: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newFactura = [...client.factura];
    const description = `${quantity} ${JSON.parse(productSelected).product.name} de ${JSON.parse(roomSelected).name}`;
    const date = new Date().toLocaleString();
    const price =
      quantity * parseFloat(JSON.parse(productSelected).product.salePrice);

    const data = {
      description,
      date,
      price,
      type: "consumo",
    };
    newFactura.push(data);
    handleSubmit(
      {
        factura: newFactura,
        productId: JSON.parse(productSelected).product._id,
        roomId: JSON.parse(roomSelected).id,
        type: data.type,
        date: data.date,
      },
      client._id,
    );
    updateDetails();
    setQuantity(0);
    setRoomSelected("");
    setProductSelected("");
    setShowAddConsumes(false);
  };

  return (
    <>
      <ul className={"flex gap-2 flex-wrap justify-between"}>
        <InfoItem label={"Nombre"} text={client.name} />
        <InfoItem label={"Email"} text={client.email} />
        <InfoItem label={"Teléfono"} text={client.phone?.toString()} />
        <InfoItem label={"DNI"} text={client.dni} />
        <InfoItem label={"Estado"} text={client.status} />
      </ul>

      <ul className={"flex flex-wrap flex-col gap-2"}>
        <p className={"text-sm text-white/70 block"}>Habitaciones</p>
        {clientRooms && clientRooms.length > 0 ? (
          clientRooms.map((room: any) => (
            <InfoItem label={room?.name} key={room?._id}>
              <p>
                Productos: {room?.products.length} Inventario:{" "}
                {room?.inventary.length}
              </p>
            </InfoItem>
          ))
        ) : (
          <InfoItem label={""} text={"Este cliente no tiene habitaciones"} />
        )}
      </ul>

      <div className={"border border-border rounded"}>
        <div className={"border-b flex justify-end gap-3 p-4"}>
          <Button
            disabled={client && client.status === "inactivo"}
            variant={"secondary"}
            className={"rounded"}
            onClick={() => setShowAddServices(true)}
          >
            <CarTaxiFront size={18} color={"white"} /> Añadir Servicio
          </Button>
          <Button
            className={"rounded"}
            disabled={client && client.status === "inactivo"}
            onClick={() => setShowAddConsumes(true)}
          >
            <Milk size={18} color={"black"} /> Añadir Consumo
          </Button>
        </div>

        <ul className={"flex flex-col gap-2 p-2 transition-all"}>
          {client.factura?.length > 0 ? (
            client.factura.toReversed().map((fac: any, i) => (
              <InfoItem label={"$ " + fac.price} key={i}>
                <div className={"flex justify-between flex-wrap items-center"}>
                  <div>
                    <p>{fac.description}</p>
                    <small className={"text-foreground/70"}>{fac.date}</small>
                  </div>

                  <p className={`text-foreground/70`}>
                    {fac.type === "consumo" ? (
                      <Milk size={18} color={"white"} />
                    ) : (
                      <CarTaxiFront size={18} color={"white"} />
                    )}
                  </p>
                </div>
              </InfoItem>
            ))
          ) : (
            <li className={"p-4 text-center text-white/70"}>
              El cliente no ha consumido ni solicitado servicios.
            </li>
          )}
        </ul>

        <p className={"p-3 text-foreground/70 border-t border-border"}>
          Total:{" $"}
          {client.factura
            ?.reduce((acc, curr) => acc + curr.price, 0)
            .toFixed(2)}
        </p>
      </div>

      {showAddServices && (
        <Dialog open>
          <DialogContent>
            <DialogTitle>Añadir Servicio</DialogTitle>
            <GenericForm
              schema={ClientFormServicesSchema}
              defaultValues={{}}
              onSubmit={onSubmitServices}
              formConfig={clientFormServicesConfig}
              onCancelClick={() => setShowAddServices(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddConsumes && (
        <Dialog open>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Añadir Consumo</DialogTitle>

            <form onSubmit={onSubmitConsumes} className={"flex flex-col gap-4"}>
              <div className={"col-span-3 flex flex-col gap-2"}>
                <label className={"text-foreground text-base"}>
                  Habitación
                </label>
                <Select
                  onValueChange={selectRoomChangeHandler}
                  value={roomSelected || ""}
                  required={true}
                >
                  <SelectTrigger className="w-fit rounded">
                    <SelectValue placeholder={"Selecciona la habitación"} />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    <SelectGroup>
                      {clientRooms &&
                        clientRooms?.length > 0 &&
                        clientRooms?.map((room: any) => (
                          <SelectItem
                            value={JSON.stringify({
                              name: room.name,
                              id: room._id,
                            })}
                            key={room._id}
                            className="rounded"
                          >
                            {room.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <p className={"text-foreground/70"}>
                  Seleccionla la habitacion para poder selecionar el producto
                  consumido.
                </p>
              </div>

              <div className={"col-span-3 flex flex-col gap-2"}>
                <label className={"text-foreground text-base"}>Producto</label>
                <Select
                  onValueChange={(e) => {
                    setProductSelected(e);
                  }}
                  value={productSelected || ""}
                  disabled={!roomSelected}
                  required={true}
                >
                  <SelectTrigger className="w-fit rounded">
                    <SelectValue placeholder={"Selecciona el Producto"} />
                  </SelectTrigger>
                  <SelectContent className="rounded">
                    <SelectGroup>
                      {productsToSelect?.length > 0 &&
                        productsToSelect?.map((prod: any) => (
                          <SelectItem
                            value={JSON.stringify(prod)}
                            key={prod._id}
                            className="rounded"
                          >
                            {prod.product.name} - ${prod.product.salePrice} -
                            Cantidad: {prod.stock}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <p className={"text-foreground/70"}>
                  Selecciona el Producto consumido.
                </p>
              </div>

              <div className={"col-span-3 flex flex-col gap-2"}>
                <label className={"text-foreground text-base"}>Cantidad</label>

                <Input
                  placeholder="0"
                  value={quantity || ""}
                  disabled={!productSelected}
                  type={"number"}
                  required={true}
                  min={0}
                  max={productSelected ? JSON.parse(productSelected).stock : 0}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <p className={"text-foreground/70"}>
                  Selecciona la cantidad del producto consumido.
                </p>
              </div>

              <div className={"flex justify-start gap-2 mt-4"}>
                <Button
                  variant={"destructive"}
                  type={"button"}
                  onClick={() => {
                    setShowAddConsumes(false);
                    setRoomSelected("");
                    setProductSelected("");
                    setQuantity(0);
                  }}
                >
                  Cancelar
                </Button>
                <Button className={"rounded"} type={"submit"}>
                  Aceptar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ClientsDetails;
