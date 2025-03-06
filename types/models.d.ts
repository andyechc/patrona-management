declare type Category = {
  name: string,
  _id: string
}

declare type Product = {
  name: string,
  price: number,
  category: string,
  _id: string
}

declare type Warehouse = {
  name: string,
  price: number,
  category: string,
  _id: string,
  stock: number,
  total: number
}

