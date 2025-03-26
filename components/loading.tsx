import { Loader2 } from "lucide-react";

function Loading({text="Cargando"}:{text?:string}) {
  return ( 
    <div className="w-fit m-auto flex gap-2 font-bold animate-pulse">
      <Loader2 className="animate-spin text-blue-500"/>
      {text}
    </div>
   );
}

export default Loading;