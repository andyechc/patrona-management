"use client";
import CellActionButton from "@/components/data-table/cell-action-button";
import { DataTable } from "@/components/data-table/data-table";
import { GenericForm } from "@/components/forms/generic-form";
import {
  inventaryFormConfig,
  InventaryFormSchema,
} from "@/components/forms/schemas/room";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";

type Item = {
  name: string;
  stock: number;
};

type InventaryTableProps = {
  inventary: Item[];
  id: string;
  handleSubmit: (value: any, id: string) => void;
  updateDetails: () => void;
};

function InventaryTable({
  inventary,
  id,
  handleSubmit,
  updateDetails,
}: InventaryTableProps) {
  const [showEdit, setshowEdit] = useState(false);
  const [itemToEdit, setitemToEdit] = useState({
    name: "",
    stock: 0,
    index: 0,
  });

  const handleEdit = (i: number) => {
    const itemFound = inventary.find((_item, index) => index === i);
    if (itemFound) {
      setitemToEdit({ ...itemFound, index: i });
      setshowEdit(true);
    }
  };

  const submitEdit = async (data: z.infer<typeof InventaryFormSchema>) => {
    const filterInventary = inventary.filter(
      (_item, i) => i !== itemToEdit.index,
    );
    filterInventary.push(data);

    handleSubmit({ inventary: filterInventary }, id);
    updateDetails();
    setshowEdit(false);
  };

  const handleDelete = () => {
    const filterInventary = inventary.filter(
      (_item, i) => i !== itemToEdit.index,
    );

    handleSubmit({ inventary: filterInventary }, id);
    updateDetails();
  };

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "name",
      header: () => <Button variant="ghost">Nombres</Button>,
      cell: ({ row }) => <p>{row.getValue("name")}</p>,
    },
    {
      accessorKey: "stock",
      header: () => <Button variant="ghost">Cantidad</Button>,
      cell: ({ row }) => <p>{row.getValue("stock")}</p>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <CellActionButton
            handleDelete={handleDelete}
            handleEdit={() => handleEdit(row.index)}
          />
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        data={inventary || []}
        addHref={"/rooms/inventary/add?id=" + id}
      />

      {showEdit && (
        <Dialog open>
          <DialogContent className="rounded">
            <DialogTitle>Editar Ítem</DialogTitle>

            <GenericForm
              defaultValues={itemToEdit}
              formConfig={inventaryFormConfig}
              onSubmit={submitEdit}
              schema={InventaryFormSchema}
              onCancelClick={() => setshowEdit(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default InventaryTable;
