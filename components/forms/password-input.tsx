import { Eye, EyeClosed } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

function PasswordInput({
  label,
  name,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  name: string;
  options?: InputHTMLAttributes<any>;
}) {
  const [typeInput, setTypeInput] = useState("password");
  return (
    <label className="flex flex-col gap-2 relative">
      {label}
      {typeInput === "text" ? (
        <Eye
          className="absolute bottom-1.5 right-2 text-foreground cursor-pointer"
          onClick={() => setTypeInput("password")}
        />
      ) : (
        <EyeClosed
          className="absolute bottom-1.5 right-2 text-foreground/50 cursor-pointer"
          onClick={() => setTypeInput("text")}
        />
      )}

      <input
        className="rounded border pl-2 pr-12 py-1"
        type={typeInput}
        name={name}
        placeholder={placeholder}
        {...options}
      />
    </label>
  );
}

export default PasswordInput;
