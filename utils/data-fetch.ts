export async function GetAll({ url, setData, setError, setIsLoading }: Get) {
  setIsLoading(true);
  setError("");

  fetch(url)
    .then((res: Response) => {
      if (res.ok) {
        res.json().then((data: []) => {
          setData(data);
          return;
        });
      } else {
        setError(
          res.json().then((error) => error.message + ` - #${res.status}`),
        );
      }
    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(setIsLoading(false));
}

export async function GetById({ url, setData, setError, setIsLoading }: Get) {
  setIsLoading(true);
  setError("");

  fetch(url)
    .then((res: Response) => {
      if (res.ok) {
        res.json().then((data: object) => {
          setData(data);
          return;
        });
      } else {
        setError(
          res.json().then((error) => error.message + ` - #${res.status}`),
        );
      }
    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(setIsLoading(false));
}

export async function Post({ data, url, setError, setIsLoading }: Post) {
  setIsLoading(true);
  setError("");

  fetch(url, { method: "POST", body: JSON.stringify(data) })
    .then((res: Response) => {
      if (res.ok) {
        res.json().then((data: []) => {
          console.log(data);
          return { success: true, message: "Datos Creados Correctamente" };
        });
      } else {
        throw new Error("Error al procesar la respuesta");
      }
    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(setIsLoading(false));
}

export async function Put({ data, url, setError, setIsLoading }: Put) {
  setIsLoading(true);
  setError("");

  fetch(url, { method: "PUT", body: JSON.stringify(data) })
    .then((res: Response) => {
      if (res.ok) {
        res.json().then((data: []) => {
          console.log(data);
          return { success: true, message: "Datos Actualizados Correctamente" };
        });
      } else {
        setError(
          res.json().then((error) => error.message + ` - #${res.status}`),
        );
      }
    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(setIsLoading(false));
}

export async function Delete({ url, setError, setIsLoading }: Delete) {
  setIsLoading(true);
  setError("");

  fetch(url, { method: "DELETE" })
    .then(async (res: Response) => {
      if (res.ok) {
        const data = res.status !== 204 ? await res.json() : null;
        return data;
      } else {
        setError(
          res.json().then((error) => error.message + ` - #${res.status}`),
        );
      }
    })
    .catch((error) => {
      setError(error.message);
    })
    .finally(setIsLoading(false));
}
