import { useEffect, useState } from "react";

function usePass(data: CashRegister[]) {
  const [pass, setPass] = useState("");
  const [isSave, setIsSave] = useState(false);
  const dataPass = data[0]?.password || "";

  useEffect(() => {
    if (dataPass) {
      if (pass === atob(dataPass)) {
        setIsSave(true);
      }
    }
  }, [pass, dataPass]);

  return { setPass, isSave, pass };
}

export default usePass;
