export function formatStringToDollar(text: string) {
  return parseFloat(text).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
export function formatNumberToDollar(text: number) {
  return text.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
