type basicMethod = {
  model: Model<T>;
  sort?: Record<string, 1 | -1>;
}

declare type GetAllMethod = {
  model: Model<T>;
  sort?: Record<string, 1 | -1>;
};

declare type PostMethod = {
  body: Product | Category | Warehouse
  model: Model<T>;
};

declare type GetByIdMethod = {
  id: string;
  model: Model<T>;
}

declare type PutMethod = {
  body: Category | Product | Warehouse;
  id: string;
  model: Model<T>;
  allowedUpdates: Array<string>
}

declare type DeleteByIdMethod = {
  id: string;
  model: Model<T>;
}

declare type DeleteAllMethod = {
  model: Model<T>;
}