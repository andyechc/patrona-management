declare type Product = {
  _id: string
  name: string,
  purchasePrice: number,
  salePrice: number,
  category: string,
}

declare type Warehouse = {
  _id: string,
  productId: string,
  stock: number,
}

