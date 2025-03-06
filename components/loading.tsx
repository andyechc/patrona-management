import { Loader2 } from "lucide-react";

function Loading() {
  return ( 
    <div className="w-fit m-auto">
      <Loader2 className="animate-spin"/>
      Cargando...
    </div>
   );
}

export default Loading;