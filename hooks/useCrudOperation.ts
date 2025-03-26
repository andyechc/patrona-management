import { useState } from "react";
import { GetAll, Delete, Put, Post, GetById } from "@/utils/data-fetch";

export const useCrudOperations = (endpoint: string) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = (id="") => {
    if (id)
      GetById({ url: `${endpoint}/${id}`, setData, setError, setIsLoading });
    else GetAll({ url: endpoint, setData, setError, setIsLoading });
  };

  const handleDelete = (id: string) => {
    const url = id ? `${endpoint}/${id}` : endpoint;
    Delete({ url, setError, setIsLoading }).then(()=>fetchData);
  };

  const handleSubmit = (values: any, id?: string) => {
    const operation = id
      ? Put({ url: `${endpoint}/${id}`, data: values, setError, setIsLoading })
      : Post({ url: endpoint, data: values, setError, setIsLoading });

    operation.then(()=>fetchData);
  };

  return {
    data,
    error,
    setError,
    isLoading,
    setIsLoading,
    fetchData,
    handleDelete,
    handleSubmit,
  };
};
