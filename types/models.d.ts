declare type Product = {
  _id: string;
  name: string;
  purchasePrice: number;
  salePrice: number;
  category: string;
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
