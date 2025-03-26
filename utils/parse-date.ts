export default function parseDate(date: string) {
  const dateArr = date.split("T");
  const [year, time] = dateArr;

  const [hour, min, sec] = time.replace(/\..*/, "").split(":");
  const parsedTime =
    parseInt(hour) > 12
      ? `${parseInt(hour) - 12}:${min}:${min}pm`
      : `${hour}:${min}:${sec}am`;

  const parseDate = `${year} ${parsedTime}`;
  return parseDate;
}
