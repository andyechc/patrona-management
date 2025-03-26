export const typeLogParser = (type: string) =>
  (type === "warn" && (
    <p className="text-yellow-500 text-center text-4xl">•</p>
  )) ||
  (type === "losses" && (
    <p className="text-red-500 text-center text-4xl">•</p>
  )) ||
  (type === "gains" && (
    <p className="text-green-500 text-center text-4xl">•</p>
  )) ||
  (type === "info" && <p className="text-zinc-300 text-center text-4xl">•</p>);
