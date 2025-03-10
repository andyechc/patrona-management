import {
  Home,
  Bed,
  Apple,
  UserRound,
  PanelsLeftBottom,
  CircleDollarSign,
  NotebookTabs,
} from "lucide-react";

const options = [
  {
    name: "Inicio",
    id: 1,
    href: null,
    icon: null,
    isClickable: false,
    isAction: false,
    isEditable: false,
    submenu: [
      {
        name: "Dashboard",
        id: 1,
        href: "/",
        icon: PanelsLeftBottom,
        isClickable: false,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
      {
        name: "Clientes",
        id: 2,
        href: "/clients",
        icon: UserRound,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
    ],
  },
  {
    name: "Gestión",
    id: 3,
    href: null,
    icon: null,
    isClickable: false,
    isAction: false,
    isEditable: false,
    submenu: [
      {
        name: "Almacén",
        id: 1,
        href: "/warehouse",
        icon: Home,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
      {
        name: "Habitaciones",
        id: 2,
        href: "/rooms",
        icon: Bed,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
      {
        name: "Facturas",
        id: 4,
        href: "/facturies",
        icon: CircleDollarSign,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
    ],
  },
  {
    name: "Nomencladores",
    id: 4,
    href: null,
    icon: null,
    isClickable: false,
    isAction: false,
    isEditable: false,
    submenu: [
      {
        name: "Productos",
        id: 1,
        href: "/products",
        icon: Apple,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
      {
        name: "Categorías",
        id: 2,
        href: "/categories",
        icon: NotebookTabs,
        isClickable: true,
        isAction: false,
        isEditable: false,
        submenu: null,
      },
    ],
  },
];

export default options;
