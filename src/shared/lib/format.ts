export function formatPrice(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 확인 필요";
  return new Intl.DateTimeFormat("ko-KR", options).format(date);
}
