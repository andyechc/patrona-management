import { ReactNode } from "react";

const InfoItem = ({
  text,
  label,
  children,
}: {
  text?: string;
  label: string;
  children?: ReactNode;
}) => {
  const isState = (text && text === "activo") || text === "inactivo";
  const className =
    "font-semibold text-foreground rounded " +
    ((isState &&
      (text === "activo" ? "bg-green-800 px-2" : "bg-red-800 px-2")) ||
      "foreground");

  return (
    <li
      className={"bg-border/50 flex flex-col gap py-2 px-4 rounded flex-grow"}
    >
      <small className={"text-sm font-normal text-white/70"}>{label}</small>
      {children ? children : <p className={className}>{text || "N/A"}</p>}
    </li>
  );
};

export default InfoItem;
