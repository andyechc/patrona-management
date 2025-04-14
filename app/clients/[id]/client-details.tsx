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
import { CarTaxiFront, Milk } from "lucide-react";

const InfoItem = ({
  text,
  label,
  children,
}: {
  text?: string;
  label: string;
  children?: ReactNode;
}) => {
  const isState = (text && text === "Activo") || text === "Inactivo";
  const className =
    "text-xl font-semibold text-" +
    ((isState && (text === "Activo" ? "green-500" : "red-400")) ||
      "foreground");

  return (
    <li
      className={"bg-border/50 flex flex-col gap py-2 px-4 rounded flex-grow"}
    >
      <small className={"text-sm font-normal text-white/70"}>{label}</small>
      {children ? children : <p className={className}>{text || "N/A"}</p>}
    </li>
  );
};

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
  const { data: rooms, fetchData } = useCrudOperations("/api/rooms");

  const clientRooms =
    (rooms.length > 0 &&
      client &&
      client?.rooms?.map((clientRoom) =>
        rooms.find((room: Room) => room._id === clientRoom),
      )) ||
    [];

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmitServices = (data: z.infer<typeof ClientFormServicesSchema>) => {
    const date = new Date().toISOString();
    const service = { ...data, type: "servicio", date };
    const newFactura = [...client.factura];
    newFactura.push(service);
    handleSubmit({ factura: newFactura }, client._id);
    updateDetails();
    setShowAddServices(false);
  };

  const selectRoomChangeHandler = (room: string): void => {
    setRoomSelected(room);

    const roomSelected: any = clientRooms.find(
      (clientRoom: any) => clientRoom.name === room,
    );
    const productsFind = roomSelected.products;

    setProductsToSelect(productsFind || []);
  };

  const onSubmitConsumes: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newFactura = [...client.factura];
    const description = `Se Consumió ${quantity} ${JSON.parse(productSelected).product.name} de ${roomSelected}`;
    const date = new Date().toISOString();
    const price =
      quantity * parseFloat(JSON.parse(productSelected).product.salePrice);

    const data = { description, date, price, type: "consumo" };
    newFactura.push(data);
    handleSubmit({ factura: newFactura }, client._id);
    updateDetails();
    setShowAddConsumes(false);
  };

  return (
    <>
      <ul className={"flex gap-4 flex-wrap justify-between"}>
        <InfoItem label={"Nombre"} text={client.name} />
        <InfoItem label={"Email"} text={client.email} />
        <InfoItem label={"Teléfono"} text={client.phone?.toString()} />
        <InfoItem label={"DNI"} text={client.dni} />
        <InfoItem
          label={"Estado"}
          text={client.status === "activo" ? "Activo" : "Inactivo"}
        />
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
            variant={"secondary"}
            className={"rounded"}
            onClick={() => setShowAddServices(true)}
          >
            <CarTaxiFront size={18} color={"white"} /> Añadir Servicio
          </Button>
          <Button
            className={"rounded"}
            onClick={() => setShowAddConsumes(true)}
          >
            <Milk size={18} color={"black"} /> Añadir Consumo
          </Button>
        </div>

        <ul className={"flex flex-col gap-2 p-2 transition-all"}>
          {client.factura?.length > 0 ? (
            client.factura
              .sort((a: any, b: any) => (b.date > a.date ? 1 : -1))
              .map((fac: any, i) => (
                <InfoItem label={"$ " + fac.price} key={i}>
                  <div
                    className={"flex justify-between flex-wrap items-center"}
                  >
                    <div>
                      <p>{fac.description}</p>
                      <small className={"text-foreground/70"}>
                        {fac.date?.split("T")[0]}
                      </small>
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

        <p className={"p-3 text-foreground/70"}>
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
                            value={room.name || room._id}
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
                  min={0}
                  max={productSelected ? JSON.parse(productSelected).stock : 0}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <p className={"text-foreground/70"}>
                  Selecciona la cantidad del producto consumido.
                </p>
              </div>

              <div
                className={
                  "flex justify-start gap-2 mt-4 border-t border-border"
                }
              >
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
