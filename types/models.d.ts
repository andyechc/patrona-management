declare type Product = {
  _id: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  category: string;
  currency: string;
};

declare type Warehouse = {
  _id: string;
  productId: string;
  stock: number;
};

declare type CashRegister = {
  _id: string;
  password: string;
  exchangeRate: number;
  balances: {
    primary: {
      amount: number;
      currency: string;
    };
    secondary: {
      amount: number;
      currency: string;
    };
  };
};

declare type DailyLog = {
  _id: string;
  title: string;
  description: string;
  type: "gains" | "losses" | "warn" | "info";
  date: string;
};

declare type Notes = {
  _id: string;
  title: string;
  description: string;
  date: string;
};

declare type Room = {
  _id: string;
  name: string;
  inventary: Array;
  products: Array;
};

declare type Client = {
  _id: string;
  name: string;
  email?: string;
  phone?: number;
  dni?: string;
  factura: any[];
  rooms: string[];
  status: "activo" | "inactivo";
};

declare type Factura = {
  _id: string;
  clientId: string;
  factura: any[];
  date: string;
  status: "pendiente" | "pagado";
};
