declare type Get = {
  url: string;
  setData: Dispatch<SetStateAction<never[]>>;
  setError: Dispatch<SetStateAction<never[]>>;
  setIsLoading: Dispatch<SetStateAction<never[]>>;
};

declare type Post = {
  url: string;
  setError: Dispatch<SetStateAction<never[]>>;
  setIsLoading: Dispatch<SetStateAction<never[]>>;
  data: object
};

declare type Put = {
  url: string;
  setError: Dispatch<SetStateAction<never[]>>;
  setIsLoading: Dispatch<SetStateAction<never[]>>;
  data: object
};

declare type Delete = {
  url: string;
  setError: Dispatch<SetStateAction<never[]>>;
  setIsLoading: Dispatch<SetStateAction<never[]>>;
};