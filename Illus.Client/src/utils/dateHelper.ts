function formatFullISODateString(_date: Date) {
  const dateStr = _date.toLocaleDateString().split("/");

  return (
    dateStr[0].padStart(4, "0") +
    "-" +
    dateStr[1].padStart(2, "0") +
    "-" +
    dateStr[2].padStart(2, "0")
  );
}
function formatISOTimeString(_date: Date) {
  return (
    _date.getHours().toString().padStart(2, "0") +
    ":" +
    _date.getMinutes().toString().padStart(2, "0")
  );
}

export { formatFullISODateString, formatISOTimeString };
