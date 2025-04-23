import DailyLog from "@/models/DailyLog";
import { Post } from "@/utils/api/method-handler";

export async function dailyLogOperations({
  description,
  title,
  type,
}: {
  title: string;
  description: string;
  type: "losses" | "gains" | "warn" | "info";
}) {
  const log = {
    title,
    description,
    type,
    date: new Date().toLocaleString(),
  };

  await Post({
    body: log,
    model: DailyLog,
  });
}
